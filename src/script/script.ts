namespace WebComponentsManager {

  /**
   * A stand-in component for the native script tag that defers the loading of the targeted script until the links
   * within the scope of the component are resolved.
   *
   * @class WebComponentsManager.Script
   * @extends HTMLElement
   */
  @registerComponent("wcm-script")
  export class Script extends Base {

    public static importTarget(this: Script): Promise<void> {
      return Utils.promiseTimeout(30000,
        Promise.all<void>([].map.call(this.parentElement.querySelectorAll("wcm-link, link"), (link: Link | HTMLLinkElement): Promise<void> => {
          if (link.hasOwnProperty("whenLoaded")) {
            console.log("CUSTOM")
            return link["whenLoaded"] as Promise<void>;
          } else {
            console.log("VANILLA")
            return link["import"] || Utils.promisifyEvent.call(link, "load");
          }
        }))
          .then((): Promise<string> => {
            return Utils.generateDownloadUrl.call(this, this.for, this.lookup);
          })
          .then((downloadUrl: string): void => {
            return Utils.importScript.call(this, downloadUrl);
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
      this.init().then(Script.importTarget.bind(this));
    }

  }

}
