namespace WebComponentsManifest {

  /**
   * A representation of the required keys expected to be present in the Manifest JSON.
   */
  export interface Manifest {
    uri: string;
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
    lookup: string;
  }

  @RegisterComponent("wcm-shell")
  export class Shell extends HTMLElement {

    /**
     * The URL of the Manifest to be loaded and then parsed by the Shell.
     *
     * @type {String}
     */
    public get url(): string {
      return this.getAttribute("url");
    }

    /**
     * An optional attribute that defines which component the Shell should insert upon importing the Manifest.
     *
     * @type {String}
     */
    public get for(): string {
      return this.getAttribute("for");
    }

    /**
     * Legacy callback support for WebComponents V0. This method will begin the bootstrapping process within the Shell.
     *
     * @returns {Void}
     */
    public attachedCallback(): void {
      this.bootstrapApplication();
    }

    /**
     * This is a private method responsible for the bootstrapping of the Shell. It will load the Manifest, import the
     * dependencies, and then populate it's shadow root with the relevant nodes.
     *
     * @private
     *
     * @returns {Promise<Void>}
     */
    private bootstrapApplication(): Promise<void> {
      const shadow = this.attachShadow({ mode: "open" });
      const fragment = document.createDocumentFragment();

      return Promise.resolve(this.url)
        .then(Utils.loadManifest)
        .then(Utils.importManifest)
        .then((): void => {
          fragment.appendChild(document.createElement(this.for || "slot"));
          shadow.appendChild(fragment);
        });
    }

  }

  export function RegisterComponent<T>(name: string): (target: T) => void {
    return (target: T): void => {
      document.registerElement(name, { prototype: (target as any).prototype });
    };
  }

  export namespace Utils {

    export function fetchUrl(url: string): Promise<any> {
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

    export function loadManifest(url: string): Promise<Manifest> {
      return fetchUrl(url).then(JSON.parse);
    }

    export function importManifest(manifest: Manifest): Promise<void[]> {
      return Promise.all(manifest.shrinkwrap.map((dependency): Promise<void> => {
        return new Promise<void>((resolve) => {
          const attrs = {
            href: (dependency.uri || manifest.uri)
              .replace("<name>", dependency.name)
              .replace("<version>", dependency.version)
              .replace("<lookup>", dependency.lookup),
            rel: dependency.rel || "import",
          };

          let link: HTMLLinkElement = document.head.querySelector(`link[href="${attrs.href}"]`) as any;

          if (!link) {
            link = document.createElement("link");
            link.rel = attrs.rel;
            link.href = attrs.href;
            document.head.appendChild(link);
            link.addEventListener("load", () => void resolve());
          } else {
            resolve();
          }
        });
      }));
    }
  }

}
