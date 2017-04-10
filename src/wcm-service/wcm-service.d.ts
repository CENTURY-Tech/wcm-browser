declare interface InterfaceWcmService extends polymer.Base {
  getManifest(): any;
  setManifest(manifest: any): void;

  importComponent(name: string): Promise<any>;
  importComponents(...names: string[]): Promise<any>;

  checkManifestIsLoaded(): void;
  checkComponentIsDefined(name: string): void;
}
