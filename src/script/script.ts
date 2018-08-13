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

    public [Base.loader](this: Script, context: Document, src: String): Promise<any> {
      return Promise.all([].map.call(context.querySelectorAll("wcm-link"), (link: Link) => {
        return Utils.whenDefined(link, DOM.ready);
      })).then((): Promise<Event> => {
        return DOM.promisifyEvent(document.body.appendChild(DOM.createElement("script", { src })), "load")
      });
    }

  }

}
