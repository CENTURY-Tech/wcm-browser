namespace WebComponentsManifest {

  /**
   * A stand-in component for the native script tag that defers the loading of the targeted script until the links
   * within the scope of the component are resolved.
   *
   * @class WebComponentsManifest.Script
   * @extends HTMLElement
   */
  @registerComponent("wcm-script")
  export class Script extends HTMLElement {

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
      setTimeout(() => this.importDependency());
    }

    /**
     * This is a private method that import the target required by this component.
     *
     * @private
     *
     * @returns {Void}
     */
    private importDependency(): void {
      Promise.all([].map.call(this.parentElement.querySelectorAll("wcm-link"), (link) => {
        return new Promise((resolve) => {
          link.addEventListener("load", () => void resolve());
        });
      }))
        .then(() => {
          Utils.importScript(this, this.for ? Utils.generateDownloadUrl(this.for, this.lookup) : this.lookup);
        });
    }

  }

}
