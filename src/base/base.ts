namespace WebComponentsManager {

  /**
   * A collection of utility methods used throughout the library.
   *
   * @namespace WebComponentsManager.Utils
   */
  export abstract class Base extends HTMLElement {

    public whenLoaded: Promise<void> | boolean;

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

    public async init(): Promise<void> {
      Utils.promisifyAssignKey(this, "whenLoaded");
    }

  }

}
