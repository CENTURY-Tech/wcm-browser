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

  /**
   * A collection of utility methods used throughout the library.
   *
   * @namespace WebComponentsManager.Utils
   */
  export namespace Utils {

    const whenLoaded = Symbol();

    /**
     * A reference to the Manifest used throughout the Window.
     */
    const manifest = promisifyAssignKey<{ ref: Manifest }>({} as any, "ref");

    export async function getManifest(): Promise<Manifest> {
      return await manifest.ref;
    }

    export function setManifest(val: Manifest): void {
      manifest.ref = val;
    }

    /**
     * @todo Clean, and document this function.
     */
    export async function getDependency(dependencyName: string): Promise<Dependency> {
      const dependency = (await getManifest()).shrinkwrap.find((x) => x.name === dependencyName);

      if (!dependency) {
        console.warn("No dependency was found with the name '%s'", dependencyName);
      } else {
        return dependency;
      }
    }

    /**
     * @todo Clean, and document this function.
     */
    export async function generateDownloadUrl(this: HTMLElement, dependencyName: string, lookup?: string): Promise<string> {
      if (!dependencyName) {
        return /.*\//.exec(this.baseURI)[0] + lookup;
      } else {
        const dependencyMetadata = await getDependency(dependencyName);

        return (dependencyMetadata.uri || (await getManifest()).uri)
          .replace("<name>", dependencyMetadata.name)
          .replace("<version>", dependencyMetadata.version)
          .replace("<lookup>", lookup || "index.html");
      }
    }

    /**
     * @todo Clean, and document this function.
     */
    export function fetch(url: string): Promise<any> {
      return new Promise((resolve, reject): void => {
        const request: XMLHttpRequest = new XMLHttpRequest();

        request.onreadystatechange = (): void => {
          if (request.readyState === 4) {
            if (request.status === 200) {
              void resolve(request.responseText);
            } else {
              void reject(request.responseText);
            }
          }
        };

        void request.open("GET", url, true);
        void request.send(null);
      });
    }

    /**
     * @todo Clean, and document this function.
     */
    export function importLink(this: Link, rel: string, href: string): Promise<void> {
      return Promise.resolve(document.querySelector(`link[href="${href}"]`))
        .then((link: HTMLLinkElement): Promise<HTMLLinkElement> => {
          if (href.includes("course-")) {
            console.log("LOADING  ", href);
          }
          if (!link) {
            link = document.createElement("link");
            link.rel = rel;
            link.href = href;
            document.head.appendChild(link);

            promisifyEvent.call(promisifyAssignKey(link, whenLoaded), "load")
              .then(() => {
                link[whenLoaded] = link;
              });
          }

          return link[whenLoaded];
        })
        .then((link: HTMLLinkElement): Promise<void[]> => {
          if (link.import) {
            return Promise.all<void>([].map.call(link.import.querySelectorAll("wcm-link, wcm-script"), (elem: Link | Script) => {
              return elem.whenLoaded;
            }));
          }
        })
        .then((): void => {
          if (href.includes("course-")) {
            console.log("LOADED ", href);
          }
          this.whenLoaded = true;
        });
    }

    /**
     * @todo Clean, and document this function.
     */
    export function importScript(this: Script, src: string): Promise<void> {
      return Promise.resolve(document.head.querySelector(`script[src="${src}"]`))
        .then((script: HTMLScriptElement): Promise<HTMLScriptElement> => {
          if (!script) {
            script = document.createElement("script");
            script.src = src;
            this.parentElement.appendChild(script);

            promisifyEvent.call(promisifyAssignKey(script, whenLoaded), "load")
              .then(() => {
                script[whenLoaded] = true;
              });
          }

          return script[whenLoaded];
        })
        .then((): void => {
          this.whenLoaded = true;
        });
    }

    /**
     * @todo Clean, and document this function.
     */
    export function promisifyEvent(this: HTMLElement, event: string): Promise<Event> {
      const handler = (resolve) => (evt): void => {
        this.removeEventListener(event, handler);
        resolve(evt);
      };

      return new Promise<Event>((resolve): void => {
        this.addEventListener(event, handler(resolve));
      });
    }

    export function promisifyAssignKey<T extends object>(obj: T, key: string | symbol): T {
      let setter;
      let getter = new Promise((resolve): void => {
        setter = (val) => (getter = val, setter = () => null, resolve(val));
      });

      return Object.defineProperty(obj, key, { get: () => getter, set: setter });
    }

    export function promiseTimeout<T>(ms: number, promise: Promise<T>): Promise<T | void> {
      let id;
      const timeout = new Promise<void>((_resolve, reject) => {
        id = setTimeout(() => {
          reject("Timed out in " + ms + "ms.");
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

  }

}
