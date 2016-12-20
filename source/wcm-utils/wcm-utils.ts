"use strict";

window.addEventListener("WebComponentsReady", (): void => {

  /**
   * A suite of basic utilities that support WCM.
   *
   * @example
   * <wcm-utils id="wcmUtils"></wcm-utils>
   */
  @component("wcm-utils")
  class WcmUtils extends polymer.Base implements InterfaceWcmUtils {

    /**
     * Basic noop function.
     */
    public get noop(): () => any {
      return (): void => { /* */ };
    }

    /**
     * Throw an error explaining that the manifest failed to load.
     */
    public get manifestLoadingError(): () => any {
      return (): void => {
        throw Error("Failed to load manifest");
      };
    }

    /**
     * Throw an error explaining that the manifest has not been loaded.
     */
    public get manifestNotLoadedError(): () => any {
      return (): void => {
        throw Error("Manifest not loaded");
      };
    }

    /**
     * Throw an error explaining that the component is not available
     */
    public get componentNotAvaliableError(): () => any {
      return (): void => {
        throw Error("Component not available");
      };
    }

    /**
     * Throw an error explaining that the component failed to load.
     */
    public get componentLoadingError(): () => any {
      return (): void => {
        throw Error("Failed to load component");
      };
    }

    /**
     * Perform a GET request against the URL provided.
     */
    public fetch(url: string): Promise<any> {
      return new Promise((resolve, reject): void => {
        const request: XMLHttpRequest = new XMLHttpRequest();

        request.onreadystatechange = (): void => {
          if (request.readyState === 4) {
            if (request.status === 200) {
              void resolve(request.responseText);
            } else {
              void reject(request.responseText);
            }
          }
        };

        void request.open("GET", url, true);
        void request.send(null);
      });
    }

    /**
     * Remove the supplied component instance from the DOM.
     */
    public removeComponent(scope: polymer.Base): void {
      void scope.remove();
    }

  }

  WcmUtils.register();

});
