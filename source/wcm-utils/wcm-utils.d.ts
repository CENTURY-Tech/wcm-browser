declare interface InterfaceWcmUtils extends polymer.Base {
  noop: () => void;
  manifestNotLoadedError: () => void;
  manifestLoadingError: () => void;
  componentNotAvaliableError: () => void;
  componentLoadingError: () => void;

  fetch(url: string): Promise<any>;

  removeComponent(scope: polymer.Base): void;
}
