namespace WebComponentsManifest {

  /**
   * The Shell component that initialises the Manifest at the specified URL and bootstraps the application accordingly.
   *
   * @class WebComponentsManifest.Shell
   * @extends HTMLElement
   */
  @registerComponent("wcm-shell")
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
     * Which component the Shell should load as the application entry component after importing the Manifest.
     *
     * @type {String}
     */
    public get main(): string {
      return this.getAttribute("main");
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
        .then((url: string): Promise<Manifest> => {
          return Utils.fetch(url).then(JSON.parse);
        })
        .then((manifest: Manifest): Promise<void> => {
          Utils.setManifest(manifest);
          return Utils.importLink.call(this, "import", Utils.generateDownloadUrl.call(this, manifest.main));
        })
        .then((): void => {
          fragment.appendChild(document.createElement(this.firstChild ? "slot" : this.main));
          shadow.appendChild(fragment);
        });
    }

  }

}
