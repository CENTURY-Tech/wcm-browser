namespace WebComponentsManager {

  /**
   * @class WebComponentsManager.Base
   * @extends HTMLElement
   */
  export abstract class Base extends HTMLElement {

    public static loader = "__loader";
    public static observedAttributes = ["path", "for"];

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

    /**
     *
     * @returns {Void}
     */
    public connectedCallback(): void {
      if (!this[Base.loader]) {
        return;
      }

      if (this.for || this.path) {
        this.attributeChangedCallback();
      }
    }

    public attributeChangedCallback() {
      delete this.attributeChangedCallback;

      Utils.timeoutPromise<void>(Utils.timeoutDuration, this[Base.loader]())
        .catch(console.error.bind(null, "Error from '%s': %o", this.for || this.path));
    }

  }

  /**
   * https://github.com/webcomponents/webcomponentsjs/issues/809
   * required for Firefox
   */
  Base.prototype.constructor = Base;

}
