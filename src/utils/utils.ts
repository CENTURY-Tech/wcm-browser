namespace WebComponentsManifest {

  /**
   * A collection of utility methods used throughout the library.
   *
   * @namespace WebComponentsManifest.Utils
   */
  export namespace Utils {

    /**
     * A reference to the Manifest used throughout the Window.
     */
    let manifest: Manifest;

    /**
     * This method will save the value provided as the Manifest to be used throughout the Window.
     *
     * @param {Object} val - The Manifest to be stored
     *
     * @returns {Void}
     */
    export function setManifest(val: Manifest): void {
      manifest = val;
    }

    /**
     * This method will return the Manifest used throughout the Window.
     *
     * @returns {Object} The Manifest used throughout the Window
     */
    export function getManifest(): Manifest {
      return manifest;
    }

    /**
     * @todo Clean, and document this function.
     */
    export function getDependency(dependencyName: string): Dependency {
      const dependency = manifest.shrinkwrap.find((dependency) => dependency.name === dependencyName);

      if (!dependency) {
        console.warn("No dependency was found with the name '%s'", dependencyName);
      } else {
        return dependency;
      }
    }

    /**
     * @todo Clean, and document this function.
     */
    export function generateDownloadUrl(dependencyName: string, lookup?: string): string {
      const dependencyMetadata = getDependency(dependencyName);

      return (dependencyMetadata.uri || manifest.uri)
        .replace("<name>", dependencyMetadata.name)
        .replace("<version>", dependencyMetadata.version)
        .replace("<lookup>", lookup || "index.html");
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
    export function importLink(placement: HTMLElement, rel: string, href: string): Promise<void> {
      return new Promise<void>((resolve) => {
        let link: HTMLLinkElement = document.querySelector(`link[href="${href}"]`) as any;

        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          link.href = href;
          document.head.appendChild(link);
          link.addEventListener("load", () => {
            placement.dispatchEvent(new Event("load"));
            resolve();
          })
        } else {
          resolve();
        }
      });
    }

    /**
     * @todo Clean, and document this function.
     */
    export function importScript(placement: HTMLElement, src: string): Promise<void> {
      return new Promise<void>((resolve) => {
        let script: HTMLScriptElement = document.head.querySelector(`script[src="${src}"]`) as any;

        if (!script) {
          script = document.createElement("script");
          script.src = /.*\//.exec(placement.baseURI)[0] + src;
          document.head.appendChild(script);
          script.addEventListener("load", () => {
            placement.dispatchEvent(new Event("load"));
            resolve();
          });
        } else {
          resolve();
        }
      });
    }

  }

}
