namespace WebComponentsManifest {

  export namespace Utils {

    let manifest: Manifest;

    export function setManifest(val: Manifest): void {
      manifest = val;
    }

    export function getManifest(): Manifest {
      return manifest;
    }

    export function getDependencyMetadata(dependencyName: string): DependencyMetadata {
      const dependency = manifest.shrinkwrap.find((dependency) => dependency.name === dependencyName);

      if (!dependency) {
        console.warn("No dependency was found with the name '%s'", dependencyName);
      } else {
        return dependency;
      }
    }

    export function generateDownloadUrl(dependencyName: string, lookup?: string): string {
      const dependencyMetadata = getDependencyMetadata(dependencyName);

      return (dependencyMetadata.uri || manifest.uri)
        .replace("<name>", dependencyMetadata.name)
        .replace("<version>", dependencyMetadata.version)
        .replace("<lookup>", lookup || "index.html");
    }

    export function fetch(url: string): Promise<any> {
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

    export function importLink(placement: HTMLElement, rel: string, href: string): Promise<void> {
      return new Promise<void>((resolve) => {
        let link: HTMLLinkElement = document.querySelector(`link[href="${href}"]`) as any;

        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          link.href = href;
          document.head.appendChild(link);
          link.addEventListener("load", () => {
            placement.dispatchEvent(new Event("load"));
            resolve();
          })
        } else {
          resolve();
        }
      });
    }

    export function importScript(placement: HTMLElement, src: string): Promise<void> {
      return new Promise<void>((resolve) => {
        let script: HTMLScriptElement = document.head.querySelector(`script[src="${src}"]`) as any;

        if (!script) {
          script = document.createElement("script");
          script.src = /.*\//.exec(placement.baseURI)[0] + src;
          document.head.appendChild(script);
          script.addEventListener("load", () => {
            placement.dispatchEvent(new Event("load"));
            resolve();
          });
        } else {
          resolve();
        }
      });
    }

  }

}
