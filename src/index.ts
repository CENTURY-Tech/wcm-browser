/**
 * Clear cut dependency management for Web Components.
 *
 * @namespace WebComponentsManifest
 */
namespace WebComponentsManifest {

  /**
   * A representation of the required keys expected to be present in the Manifest JSON.
   */
  export interface Manifest {
    uri: string;
    main: string;
    shrinkwrap: Dependency[];
  }

  /**
   * A representation of the expected keys that a Dependency must have.
   */
  export interface Dependency {
    uri?: string;
    rel?: string;
    name: string;
    version: string;
  }

  /**
   * This decorator registers the targeted class as a new custom Web Component with the name provided.
   *
   * @param {String} name - The name to be used when registering the component
   *
   * @returns {Void}
   */
  export function registerComponent<T>(name: string): (target: T) => void {
    return (target: T): void => {
      document["registerElement"](name, { prototype: (target as any).prototype });
    };
  }

}
