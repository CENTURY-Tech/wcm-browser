namespace WebComponentsManifest {

  /**
   * A representation of the required keys expected to be present in the Manifest JSON.
   */
  export interface Manifest {
    uri: string;
    main: string;
    shrinkwrap: DependencyMetadata[];
  }

  /**
   * A representation of the expected keys that a Dependency must have.
   */
  export interface DependencyMetadata {
    uri?: string;
    rel?: string;
    name: string;
    version: string;
  }

  export function registerComponent<T>(name: string): (target: T) => void {
    return (target: T): void => {
      document["registerElement"](name, { prototype: (target as any).prototype });
    };
  }

}
