namespace WebComponentsManager {

  /**
   * The Shell component that initialises the Manifest at the specified URL and bootstraps the application accordingly.
   *
   * @class WebComponentsManager.Shell
   * @extends HTMLElement
   */
  @DOM.registerComponent("wcm-shell")
  export class Shell extends Base {

    /**
     * The URL of the Manifest to be loaded and then parsed by the Shell.
     *
     * @type {String}
     */
    public get url(): string {
      return this.getAttribute("url");
    }

    /**
     * Legacy callback support for WebComponents V0. This method will begin the bootstrapping process within the Shell.
     *
     * @returns {Void}
     */
    public connectedCallback(): void {
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
      const shadow = this.attachShadow && this.attachShadow({ mode: "open" }) || this;
      const fragment = document.createDocumentFragment();

      return Promise.resolve(this.url)
        .then((url: string): Promise<Manifest> => {
          return Utils.fetchResource(url).then(JSON.parse);
        })
        .then((manifest: Manifest) => {
          Shrinkwrap.manifest = manifest;

          if (this.for || this.path) {
            const config: {[key in "for" | "path"]?: string} = {};

            if (this.for) {
              config.for = this.for;
            }

            if (this.path) {
              config.path = this.path;
            }

            return Utils.whenDefined(DOM.createElement("wcm-link", config), DOM.ready);
          }
        })
        .then((): void => {
          fragment.appendChild(document.createElement(this.firstChild ? "slot" : this.for));
          shadow.appendChild(fragment);
        })
        .then((): void => {
          this[DOM.ready] = true;
        });
    }

  }

}
