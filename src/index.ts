/**
 * Clear cut dependency management for Web Components.
 *
 * @namespace WebComponentsManager
 */
namespace WebComponentsManager {

  /**
   * A representation of the required keys expected to be present in the Manifest JSON.
   */
  export interface Manifest {
    uri: string;
    main: string;
    shrinkwrap: Dependency[];
  }

  /**
   * A representation of the expected keys that a Dependency must have.
   */
  export interface Dependency {
    uri?: string;
    rel?: string;
    name: string;
    version: string;
  }

  /**
   * @namespace WebComponentsManager.DOM
   */
  export namespace DOM {

    export type CustomHTMLElementTagName = keyof HTMLElementTagNameMap | "wcm-link" | "wcm-script";

    export interface CustomHTMLElementTagNameMap extends HTMLElementTagNameMap {
      "wcm-link": Link;
      "wcm-script": Script;
    }

    export const ready = Symbol();

    /**
     * This decorator registers the targeted class as a new custom Web Component with the name provided.
     *
     * @param {String} name - The name to be used when registering the component
     *
     * @returns {Void}
     */
    export function registerComponent<T>(name: string): (target: T) => void {
      return (target: T): void => {
        document["registerElement"](name, { prototype: (target as any).prototype });
      };
    }

    export function createElement<K extends CustomHTMLElementTagName>(tagName: K, attrs: object): CustomHTMLElementTagNameMap[K] {
      const elem = document.createElement(tagName);

      for (let key in attrs) {
        elem.setAttribute(key, attrs[key]);
      }

      return elem;
    }

    export function waitForLink(link: HTMLLinkElement): Promise<void | void[]> {
      if (link.rel === "stylesheet" && link.style) {
        return Promise.resolve();
      }

      return link.import
        ? Promise.all<void>([
          ...[].map.call(link.import.querySelectorAll("link"), waitForLink),
          ...[].map.call(link.import.querySelectorAll("wcm-link, wcm-script"), (elem: Link | Script) => {
            return Utils.whenDefined(elem, DOM.ready);
          })
        ])
        : promisifyEvent(link, "load").then(() => waitForLink(link));
    }

    export function promisifyEvent(target: HTMLElement, event: string): Promise<Event> {
      let handler: any = (resolve) => {
        return (evt: Event): void => {
          target.removeEventListener(event, handler);
          resolve(evt);
        };
      };

      return new Promise((resolve): void => {
        handler = handler(resolve);
        target.addEventListener(event, handler);
      });
    }

  }

  /**
   * @namespace WebComponentsManager.Shrinkwrap
   */
  export namespace Shrinkwrap {

    /**
     * A reference to the Manifest used throughout the Window.
     */
    export let manifest: Manifest;

    function getDependencyByName(manifest: Manifest, name: string): Dependency | never {
      for (let dependency of manifest.shrinkwrap) {
        if (dependency.name === name) {
          return dependency;
        }
      }

      throw Error(`No dependency was found with the name '${name}'`);
    }

    /**
     * @todo Clean, and document this function.
     */
    export function generateDownloadUrl(target: HTMLElement, dependencyName: string, path: string): Promise<string> {
      if (!dependencyName) {
        return Promise.resolve(/http(s)?:\/\//.test(path)
          ? path
          : /.*\//.exec(target.baseURI)[0] + path);
      } else {
        return Utils.whenDefined(Shrinkwrap, "manifest")
          .then((manifest: Manifest): string => {
            const dependency = getDependencyByName(manifest, dependencyName);

            return (dependency.uri || manifest.uri)
              .replace("<name>", dependency.name)
              .replace("<version>", dependency.version)
              .replace("<path>", path || "index.html");
          });
      }
    }

  }

  /**
   * A collection of utility methods used throughout the library.
   *
   * @namespace WebComponentsManager.Utils
   */
  export namespace Utils {

    export let timeoutDuration = 30000;

    /**
     * @todo Clean, and document this function.
     */
    export function fetchResource(url: string): Promise<any> {
      return new Promise((resolve, reject): void => {
        const request: XMLHttpRequest = new XMLHttpRequest();

        request.onreadystatechange = (): void => {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(request.responseText);
            } else {
              reject(request.responseText);
            }
          }
        };

        request.open("GET", url, true);
        request.send(null);
      });
    }

    export function timeoutPromise<T>(ms: number, promise: Promise<T>): Promise<T> {
      let id;
      const timeout = new Promise<void>((_, reject) => {
        id = setTimeout(() => {
          reject(`Timed out in ${ms} ms`);
        }, ms);
      });

      return Promise.race([
        promise,
        timeout,
      ]).then((result: T): T => {
        clearTimeout(id);
        return result;
      });
    }

    export function whenDefined<T>(obj: object, key: string | symbol): Promise<T> {
      if (!obj.hasOwnProperty(key)) {
        let setter;
        let getter: any = new Promise<T>((resolve): void => {
          setter = (val: T) => (getter = val, setter = () => null, resolve(val));
        });

        Object.defineProperty(obj, key, { get: () => getter, set: setter });
      }

      return Promise.resolve(obj[key]);
    }

  }

}
