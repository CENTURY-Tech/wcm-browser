"use strict";

window.addEventListener("WebComponentsReady", (): void => {

  /**
   * Load web components lazily during runtime.
   *
   * @example
   * <wcm-link for="my-nested-component"></wcm-link>
   */
  @component("wcm-link")
  class WcmLink extends polymer.Base implements InterfaceWcmLink {

    /**
     * The name of the component to load.
     */
    @property({ type: String })
    public for: string;

    private wcmService: InterfaceWcmService;
    private wcmUtils: InterfaceWcmUtils;

    public ready(): void {
      this.wcmService = document.createElement("wcm-service") as InterfaceWcmService;
      this.wcmUtils = document.createElement("wcm-utils") as InterfaceWcmUtils;
    }

    public attached(): void {
      if (!this.for) {
        throw new Error("Component name must be provided");
      }

      void this.wcmService.importComponent(this.for).then((): void => void this.wcmUtils.removeComponent(this));
    }

  }

  WcmLink.register();

});
