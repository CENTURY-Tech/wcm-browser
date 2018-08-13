namespace WebComponentsManager {

  const load = "__load";
  const loader = "__loader";

  const elements: { [x: string]: Promise<Link | Script> } = {};

  /**
   * @class WebComponentsManager.Base
   * @extends HTMLElement
   */
  export class Base extends HTMLElement {

    public static load = load;
    public static loader = loader;

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

    // public connectedCallback(): void {
    //   if (this[Base.loader] && this.for || this.path) {
    //     this[load](document);
    //   }
    // }

    public [load](this: Base, context: Document): void {
      Shrinkwrap.generateDownloadUrl(this, this.for, this.path)
        .then((href: string): Promise<Link | Script> => {
          if (elements[href]) {
            return elements[href];
          } else {
            return elements[href] = this[Base.loader](context, href);
          }
        })
        .then((): void => {
          this[DOM.ready] = true;
        });
    }

  }

  /**
   * https://github.com/webcomponents/webcomponentsjs/issues/809
   * required for Firefox
   */
  Base.prototype.constructor = Base;

}
