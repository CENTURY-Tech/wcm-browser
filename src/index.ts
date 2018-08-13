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

  export interface Loader {
    element: HTMLElement;
    dependencies: Base[];
  }

  // function getCustomElements(): Promise<CustomElementRegistry> {
  //   if (window.customElements) {
  //     return Promise.resolve(customElements);
  //   }

  //   return new Promise((res) => {
  //     window.addEventListener("WebComponentsReady", function() {
  //       res(customElements);
  //     });
  //   });
  // }

  /**
   * @namespace WebComponentsManager.DOM
   */
  export namespace DOM {

    export type CustomHTMLElementTagName = keyof HTMLElementTagNameMap | "wcm-link" | "wcm-script";

    export interface CustomHTMLElementTagNameMap extends HTMLElementTagNameMap {
      "wcm-link": Link;
      "wcm-script": Script;
    }

    export const ready = "__ready";

    export function createElement<K extends CustomHTMLElementTagName>(
      tagName: K,
      attrs: object,
    ): CustomHTMLElementTagNameMap[K] {
      const elem = document.createElement(tagName);

      for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          elem.setAttribute(key, attrs[key]);
        }
      }

      return elem;
    }

    /**
     * This decorator registers the targeted class as a new custom Web Component with the name provided.
     *
     * @param {String} name - The name to be used when registering the component
     *
     * @returns {Void}
     */
    export function registerComponent<T extends Function>(name: string): (target: T) => void {
      return (target: T): void => {
        Utils.whenDefined(window, "customElements").then((customElements: CustomElementRegistry): void => {
          customElements.define(name, target);
        });
      };
    }

    export function promisifyEvent(target: Node, event: string): Promise<Event> {
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

    function getDependencyByName(config: Manifest, name: string): Dependency | never {
      for (const dependency of config.shrinkwrap) {
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
          .then((config: Manifest): string => {
            const dependency = getDependencyByName(config, dependencyName);

            return document.baseURI + (dependency.uri || config.uri)
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

    export function whenDefined<T>(obj: object, key: string | symbol): Promise<T> {
      if (!obj.hasOwnProperty(key)) {
        let setter;
        let getter: any = new Promise<T>((resolve): void => {
          setter = (val: T) => {
            getter = val;
            setter = () => null;
            resolve(val);
          };
        });

        Object.defineProperty(obj, key, { get: () => getter, set: setter });
      }

      return Promise.resolve(obj[key]);
    }

  }

}
