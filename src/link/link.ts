namespace WebComponentsManager {

  export type HTMLLinkElementRel = "import" | "stylesheet";

  /**
   * A stand-in component for the native link tag that ensures the required dependency is correctly versioned in
   * accordance with the Manifest.
   *
   * @class WebComponentsManager.Link
   * @extends WebComponentsManager.Base
   */
  @DOM.registerComponent("wcm-link")
  export class Link extends Base {

    /**
     * Which type of import this dependency represents, this is a enum of "import" or "stylesheet".
     *
     * @type {String}
     */
    public get rel(): HTMLLinkElementRel {
      return this.getAttribute("rel") as HTMLLinkElementRel;
    }

    public [Base.loader](this: Link, _context: Document, href: String): Promise<any> {
      const link = document.head.appendChild(DOM.createElement("link", { rel: this.rel || "import", href }));

      return DOM.promisifyEvent(link, "load").then(() => {
        return Promise.all([].map.call(link.import.querySelectorAll("wcm-link, wcm-script"), (elem: Link | Script) => {
          elem[Base.load](link.import)
          return Utils.whenDefined(elem, DOM.ready);
        }));
      });
    }

  }

}
