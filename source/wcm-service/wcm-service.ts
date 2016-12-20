"use strict";

let manifestRef: any;
const loadedElements: string[] = [];

/**
 * A service to support the loading of Web Components throughout the lifetime of the application.
 *
 * @example
 * <wcm-service id="wcmService"></wcm-service>
 */
@component("wcm-service")
class WcmService extends polymer.Base implements InterfaceWcmService {

  private wcmUtils: WcmUtils;

  public ready(): void {
    this.wcmUtils = document.createElement("wcm-utils") as WcmUtils;
  }

  /**
   * Get the manifest.
   */
  public getManifest(): any {
    return manifestRef;
  }

  /**
   * Set the manifest.
   */
  public setManifest(manifest: any): void {
    manifestRef = manifest;
  }

  /**
   * Import a component by name.
   */
  public importComponent(name: string): Promise<any> {
    this.checkManifestIsLoaded();
    this.checkComponentIsDefined(name);

    return this._importComponent(name);
  }

  /**
   * Import multiple components by name.
   */
  public importComponents(...names: string[]): Promise<any> {
    this.checkManifestIsLoaded();

    for (let name of names) {
      this.checkComponentIsDefined(name);
    }

    return Promise.all(names.map((x: string): Promise<any> => this._importComponent(x)));
  }

  /**
   * Check to see whether the manifest has yet been loaded.
   */
  public checkManifestIsLoaded(): void {
    if (!manifestRef) {
      void this.wcmUtils.manifestNotLoadedError();
    }
  }

  /**
   * Check to see whether a component with the supplied name is defined.
   */
  public checkComponentIsDefined(name: string): void {
    if (!manifestRef.shrinkwrap.hasOwnProperty(name)) {
      void this.wcmUtils.componentNotAvaliableError();
    }
  }

  private _importComponent(name: string): Promise<any> {
    if (loadedElements.indexOf(name) > -1) {
      return Promise.resolve();
    }

    return new Promise((resolve): void => {
      void this.importHref(this.getManifest().shrinkwrap[name], (): void => {
        void loadedElements.push(name);
        void resolve();
      }, this.wcmUtils.componentLoadingError);
    });
  }

}

WcmService.register();
