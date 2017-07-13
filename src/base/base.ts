namespace WebComponentsManager {

  /**
   * @class WebComponentsManager.Base
   * @extends HTMLElement
   */
  export abstract class Base extends HTMLElement {

    /**
     * The name of the dependency that should be imported.
     *
     * @type {String}
     */
    public get for(): string {
      return this.getAttribute("for");
    }

    /**
     * The path to be imported.
     *
     * @type {String}
     */
    public get path(): string {
      return this.getAttribute("path");
    }

  }

}
