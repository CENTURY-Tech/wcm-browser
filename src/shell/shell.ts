namespace WebComponentsManager {

  /**
   * The Shell component that initialises the Manifest at the specified URL and bootstraps the application accordingly.
   *
   * @class WebComponentsManager.Shell
   * @extends HTMLElement
   */
  @DOM.registerComponent("wcm-shell")
  export class Shell extends Base {

    public get context(): Document {
      return document;
    }

    /**
     * The URL of the Manifest to be loaded and then parsed by the Shell.
     *
     * @type {String}
     */
    public get url(): string {
      return this.getAttribute("url");
    }

    /**
     * Shadow DOM is enabled by default but users may disable it by setting the attribute disable-shadow
     *
     * @type {Boolean}
     */
    public get disableShadow(): boolean {
      return this.hasAttribute("disable-shadow");
    }

    /**
     * This method will begin the bootstrapping process within the Shell.
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
      const container = this.disableShadow ? this : this.attachShadow && this.attachShadow({ mode: "open" }) || this;

      return Promise.resolve(this.url)
        .then((url: string): Promise<Manifest> => {
          return Utils.fetchResource(url).then(JSON.parse);
        })
        .then((manifest: Manifest) => {
          Shrinkwrap.manifest = manifest;

          if (!this.disableShadow) {
            const fragment = document.createDocumentFragment();

            fragment.appendChild(document.createElement("slot"));
            container.appendChild(fragment);
          }

          return Promise.all([].map.call(this.querySelectorAll("wcm-link, wcm-script"), ((elem: Link | Script) => {
            elem[Base.load](document);
            return Utils.whenDefined(elem, DOM.ready);
          })));
        })
        .then((): void => {
          this[DOM.ready] = true;
        });
    }

  }

}
