namespace WebComponentsManifest {

  /**
   * A stand-in component for the native link tag that ensures the required dependency is correctly versioned in
   * accordance with the Manifest.
   *
   * @class WebComponentsManifest.Link
   * @extends HTMLElement
   */
  @registerComponent("wcm-link")
  export class Link extends HTMLElement {

    public loaded: boolean;

    /**
     * Which type of import this dependency represents, this is a enum of "import" or "stylesheet".
     *
     * @type {String}
     */
    public get rel(): "import" | "stylesheet" {
      return <any>this.getAttribute("rel");
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

    /**
     * This is a private method that import the target required by this component.
     *
     * @private
     *
     * @returns {Void}
     */
    private importDependency(): void {
      Utils.importLink.call(this, this.rel, Utils.generateDownloadUrl.call(this, this.for, this.lookup))
        .then(() => (this.loaded = true))
    }

  }

}
