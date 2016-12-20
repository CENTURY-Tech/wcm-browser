"use strict";

/**
 * Bootstrap your application or component. You can resolve all of your dependencies recursively before initialising
 * the root component by supplying the "load-all" attribute.
 *
 * @example
 * <wcm-shell for="my-web-component" load-all></wcm-shell>
 */
@component("wcm-shell")
class WcmShell extends polymer.Base implements InterfaceWcmShell {

  /**
   * The element to initialise once the dependencies have been loaded.
   */
  @property({ type: String })
  public for: string;

  /**
   * The URL from which to load the manifest, this defaults to "./manifest.json".
   */
  @property({ type: String, value: "./manifest.json" })
  public url: string;

  /**
   * Load all dependencies asynchronously prior to bootstraping the application.
   */
  @property({ type: Boolean })
  public loadAll: boolean;

  private wcmService: WcmService;
  private wcmUtils: WcmUtils;

  public ready(): void {
    this.wcmService = document.createElement("wcm-service") as WcmService;
    this.wcmUtils = document.createElement("wcm-utils") as WcmUtils;
  }

  public attached(): void {
    this.ensureManifest(this.url).then((): void => {
      if (this.loadAll) {
        void this.loadAllChildDependencies().then((): void => void this.bootstrapRootComponent(), this.wcmUtils.noop);
      } else {
        void this.loadRequiredDependencies().then((): void => void this.bootstrapRootComponent(), this.wcmUtils.noop);
      }
    }, this.wcmUtils.manifestLoadingError);
  }

  /**
   * Ensure that the component manifest has been loaded, and if not then load it from the URL provided.
   */
  private ensureManifest(url: string): Promise<any> {
    if (this.wcmService.getManifest()) {
      return Promise.resolve();
    }

    return this.wcmUtils.fetch(url).then((manifestStr: string): void => {
      void this.wcmService.setManifest(JSON.parse(manifestStr));
    }, this.wcmUtils.manifestLoadingError);
  }

  private loadRequiredDependencies(forComponent?: string): Promise<any> {
    forComponent = forComponent || this.resolveShellComponent();
    return this.wcmService.importComponents(forComponent, ...this.resolveComponentDependencies(forComponent, false));
  }

  private loadAllChildDependencies(forComponent?: string): Promise<any> {
    forComponent = forComponent || this.resolveShellComponent();
    return this.wcmService.importComponents(forComponent, ...this.resolveComponentDependencies(forComponent, true));
  }

  private bootstrapRootComponent(): void {
    void Polymer.dom(this).parentNode.replaceChild(document.createElement(this.resolveShellComponent()), this);
  }

  private resolveShellComponent(): string {
    return this.for || this.wcmService.getManifest().root;
  }

  private resolveComponentDependencies(forComponent: string, recursive: boolean): string[] {
    const dependencies: string[] = [];

    for (let dependency of this.wcmService.getManifest().graph[forComponent]) {
      if (recursive) {
        dependencies.push(dependency, ...this.resolveComponentDependencies(dependency, recursive));
      } else {
        dependencies.push(dependency);
      }
    }

    return dependencies.filter((x: string): boolean => x !== forComponent);
  }

}

WcmShell.register();
