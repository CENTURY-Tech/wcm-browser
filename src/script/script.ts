namespace WebComponentsManager {

  /**
   * A stand-in component for the native script tag that defers the loading of the targeted script until the links
   * within the scope of the component are resolved.
   *
   * @class WebComponentsManager.Script
   * @extends WebComponentsManager.Base
   */
  @DOM.registerComponent("wcm-script")
  export class Script extends Base {

    /**
     * Legacy callback support for WebComponents V0. This method will begin the import process under the current Shell.
     *
     * @returns {Void}
     */
    public createdCallback(this: Script): void {
      Utils.timeoutPromise(5000,
        Promise.all<void>([
          ...[].map.call(this.ownerDocument.querySelectorAll("link"), DOM.waitForLink),
          ...[].map.call(this.ownerDocument.querySelectorAll("wcm-link"), (link: Link) => {
            return Utils.whenDefined(link, Utils.ready);
          })
        ])
          .then((): Promise<string> => {
            return Shrinkwrap.generateDownloadUrl(this, this.for, this.path);
          })
          .then((src: string): Promise<boolean> => {
            let script = document.body.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

            if (!script) {
              script = document.body.appendChild(DOM.createElement("script", { src }));

              DOM.promisifyEvent(script, "load")
                .then(() => {
                  script[Utils.ready] = true;
                });
            }

            return Utils.whenDefined<boolean>(script, Utils.ready);
          })
          .then((): void => {
            this[Utils.ready] = true;
          })
      )
        .catch(console.error.bind(null, "Error from '%s': %o", this.for || this.path));
    }

  }

}
