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
    export function generateDownloadUrl(this: HTMLElement, dependencyName: string, lookup?: string): string {
      if (!dependencyName) {
        return /.*\//.exec(this.baseURI)[0] + lookup;
      } else {
        const dependencyMetadata = getDependency(dependencyName);

        return (dependencyMetadata.uri || manifest.uri)
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
    export function importLink(this: HTMLElement, rel: string, href: string): Promise<void> {
      return Promise.resolve(document.querySelector(`link[href="${href}"]`))
        .then((link: HTMLLinkElement): Promise<any> => {
          if (!link) {
            link = document.createElement("link");
            link.rel = rel;
            link.href = href;
            document.head.appendChild(link);
            return promisifyEvent.call(link, "load");
          }
        })
        .then((): void => {
          try {
            this.dispatchEvent(new Event("load"))
          } catch (err) { }
        });
    }

    /**
     * @todo Clean, and document this function.
     */
    export function importScript(this: HTMLElement, src: string): Promise<void> {
      return Promise.resolve(document.head.querySelector(`script[src="${src}"]`))
        .then((script: HTMLScriptElement): Promise<any> => {
          if (!script) {
            script = document.createElement("script");
            script.src = src;
            document.head.appendChild(script);
            return promisifyEvent.call(script, "load");
          }
        })
        .then((): void => {
          try {
            this.dispatchEvent(new Event("load"))
          } catch (err) { }
        });
    }

    /**
     * @todo Clean, and document this function.
     */
    export function promisifyEvent(this: HTMLElement, event: string): Promise<Event> {
      return new Promise<Event>((resolve): void => {
        this.addEventListener(event, (evt): void => resolve(evt));
      });
    }

  }

}
