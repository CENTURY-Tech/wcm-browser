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

    public [Base.loader](this: Link): Promise<void> {
      return Shrinkwrap.generateDownloadUrl(this, this.for, this.path)
        .then((href): Promise<boolean> => {
          let link = document.head.querySelector(`link[href="${href}"]`) as HTMLLinkElement;

          if (!link) {
            link = document.head.appendChild(DOM.createElement("link", { rel: this.rel || "import", href }));

            DOM.waitForLink(link)
              .then(() => {
                link[DOM.ready] = true;
              });
          }

          return Utils.whenDefined<boolean>(link, DOM.ready);
        })
        .then((): void => {
          this[DOM.ready] = true;
        });
    }

  }

}
