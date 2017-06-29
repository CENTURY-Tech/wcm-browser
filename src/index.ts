namespace WebComponentsManifest {

  /**
   * A representation of the required keys expected to be present in the Manifest JSON.
   */
  export interface Manifest {
    uri: string;
    shrinkwrap: DependencyMetadata[];
  }

  /**
   * A representation of the expected keys that a Dependency must have.
   */
  export interface DependencyMetadata {
    uri?: string;
    rel?: string;
    name: string;
    version: string;
  }

  export namespace Utils {

    export function register<T>(name: string): (target: T) => void {
      return (target: T): void => {
        document["registerElement"](name, { prototype: (target as any).prototype });
      };
    }

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

    export function importManifest(this: Shell, url: string): Promise<Manifest> {
      return fetch(url).then(JSON.parse)
    }

    export function importRoot(this: Shell, manifest: Manifest): Promise<void> {

    }

    export function importLink(rel: string, href: string): Promise<void> {
      return new Promise<void>((resolve) => {
        let link: HTMLLinkElement = document.head.querySelector(`link[href="${href}"]`) as any;

        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          link.href = href;
          document.head.appendChild(link);
          link.addEventListener("load", () => void resolve());
        } else {
          resolve();
        }
      });
    }

    export function importScript(src: string): Promise<void> {
      return new Promise<void>((resolve) => {
        let script: HTMLScriptElement = document.head.querySelector(`script[src="${src}"]`) as any;

        if (!script) {
          script = document.createElement("script");
          script.src = src;
          document.head.appendChild(script);
          script.addEventListener("load", () => void resolve());
        } else {
          resolve();
        }
      });
    }

  }

  @Utils.register("wcm-shell")
  export class Shell extends HTMLElement {

    public manifest: Manifest;

    /**
     * The URL of the Manifest to be loaded and then parsed by the Shell.
     *
     * @type {String}
     */
    public get url(): string {
      return this.getAttribute("url");
    }

    /**
     * Which component the Shell should load as the application entry file after importing the Manifest.
     *
     * @type {String}
     */
    public get root(): string {
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

    public getDependencyMetadata(dependencyName: string): DependencyMetadata {
      return this.manifest.shrinkwrap.find((dependency) => dependency.name === dependencyName);
    }

    public generateDownloadUrl(dependencyName: string, lookup: string): string {
      const dependencyMetadata = this.getDependencyMetadata(dependencyName);

      return (dependencyMetadata.uri || this.manifest.uri)
        .replace("<name>", dependencyName)
        .replace("<version>", dependencyMetadata.name)
        .replace("<lookup>", lookup);
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
        .then(Utils.importManifest.bind(this))
        .then((): void => {
          fragment.appendChild(document.createElement(this.for || "slot"));
          shadow.appendChild(fragment);
        });
    }

  }

  @Utils.register("wcm-link")
  export class Link extends HTMLElement {

    /**
     * Which type of import this dependency represents, this is a enum of "import", "stylesheet", or "script".
     *
     * @type {String}
     */
    public get type(): "import" | "stylesheet" | "script" {
      return <any>this.getAttribute("type");
    }

    /**
     * The name of the dependency that should be imported.
     *
     * @type {String}
     */
    public get for(): string {
      return this.getAttribute("for");
    }

    /**
     * The lookup path to be imported.
     *
     * @type {String}
     */
    public get lookup(): string {
      return this.getAttribute("lookup");
    }

    /**
     * Legacy callback support for WebComponents V0. This method will begin the import process under the current Shell.
     *
     * @returns {Void}
     */
    public createdCallback(): void {
      this.importDependency();
    }

    public getLocalShell(): Shell {
      let elem = this as any;

      while ((elem = elem.parentElement)) {
        if (elem.tagName === "wcm-shell") {
          return elem as Shell;
        }
      }
    }

    private importDependency(): void {
      const downloadUrl = this.getLocalShell().generateDownloadUrl(this.for, this.lookup);

      switch (this.type) {
        case "import":
        case "stylesheet":
          return void Utils.importLink(this.type, downloadUrl);

        case "script":
          return void Utils.importScript(downloadUrl);

        default:
          throw Error(`Could download "${downloadUrl}", unknown type "${this.type}"`);
      }
    }

  }

}
