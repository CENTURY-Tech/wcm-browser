namespace WebComponentsManager {

  /**
   * The Shell component that initialises the Manifest at the specified URL and bootstraps the application accordingly.
   *
   * @class WebComponentsManager.Shell
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
      const shadow = this.attachShadow && this.attachShadow({ mode: "open" }) || this;
      const fragment = document.createDocumentFragment();

      return Promise.resolve(this.url)
        .then((url: string): Promise<Manifest> => {
          return Utils.fetch(url).then(JSON.parse);
        })
        .then((manifest: Manifest): Promise<string> => {
          Utils.setManifest(manifest);

          if (this.main) {
            return Utils.generateDownloadUrl.call(this, this.main)
              .then((downloadUrl: string): Promise<void> => {
                return Utils.importLink.call(this, "import", downloadUrl);
              });
          }
        })
        .then((): void => {
          fragment.appendChild(document.createElement(this.firstChild ? "slot" : this.main));
          shadow.appendChild(fragment);
        });
    }

  }

}
