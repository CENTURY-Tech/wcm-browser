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

    public [Base.loader](this: Script): Promise<void> {
      return Promise.all<void>([
        ...[].map.call(this.ownerDocument.querySelectorAll("link"), DOM.waitForLink),
        ...[].map.call(this.ownerDocument.querySelectorAll("wcm-link"), (link: Link) => {
          return Utils.whenDefined(link, DOM.ready);
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
                script[DOM.ready] = true;
              });
          }

          return Utils.whenDefined<boolean>(script, DOM.ready);
        })
        .then((): void => {
          this[DOM.ready] = true;
        })
    }

  }

}
