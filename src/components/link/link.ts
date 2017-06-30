namespace WebComponentsManifest {

  @registerComponent("wcm-link")
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

    private importDependency(): void {
      Utils.importLink(this, this.type, Utils.generateDownloadUrl(this.for, this.lookup))
    }

  }

}
