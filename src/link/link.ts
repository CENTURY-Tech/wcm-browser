namespace WebComponentsManager {

  /**
   * A stand-in component for the native link tag that ensures the required dependency is correctly versioned in
   * accordance with the Manifest.
   *
   * @class WebComponentsManager.Link
   * @extends HTMLElement
   */
  @registerComponent("wcm-link")
  export class Link extends Base {

    /**
     * Which type of import this dependency represents, this is a enum of "import" or "stylesheet".
     *
     * @type {String}
     */
    public get rel(): "import" | "stylesheet" {
      return this.getAttribute("rel") as any;
    }

    public static importTarget(this: Link): Promise<void> {
      return Utils.promiseTimeout(30000,
        Utils.generateDownloadUrl.call(this, this.for, this.lookup)
          .then((downloadUrl: string): Promise<void> => {
            return Utils.importLink.call(this, this.rel, downloadUrl);
          }),
      )
        .catch((err) => {
          console.error("%s timeout", this.for || this.lookup, err);
        });
    }

    /**
     * Legacy callback support for WebComponents V0. This method will begin the import process under the current Shell.
     *
     * @returns {Void}
     */
    public createdCallback(): void {
      this.init().then(Link.importTarget.bind(this));
    }

  }

}
