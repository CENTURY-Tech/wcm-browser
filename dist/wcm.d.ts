declare namespace WebComponentsManager {
    interface Manifest {
        uri: string;
        main: string;
        shrinkwrap: Dependency[];
    }
    interface Dependency {
        uri?: string;
        rel?: string;
        name: string;
        version: string;
    }
    namespace DOM {
        type CustomHTMLElementTagName = keyof HTMLElementTagNameMap | "wcm-link" | "wcm-script";
        interface CustomHTMLElementTagNameMap extends HTMLElementTagNameMap {
            "wcm-link": Link;
            "wcm-script": Script;
        }
        const ready = "__ready";
        function createElement<K extends CustomHTMLElementTagName>(tagName: K, attrs: object): CustomHTMLElementTagNameMap[K];
        function registerComponent<T>(name: string): (target: T) => void;
        function waitForLink(link: HTMLLinkElement): Promise<void | void[]>;
        function promisifyEvent(target: HTMLElement, event: string): Promise<Event>;
    }
    namespace Shrinkwrap {
        let manifest: Manifest;
        function generateDownloadUrl(target: HTMLElement, dependencyName: string, path: string): Promise<string>;
    }
    namespace Utils {
        let timeoutDuration: number;
        function fetchResource(url: string): Promise<any>;
        function timeoutPromise<T>(ms: number, promise: Promise<T>): Promise<T>;
        function whenDefined<T>(obj: object, key: string | symbol): Promise<T>;
    }
}
declare namespace WebComponentsManager {
    abstract class Base extends HTMLElement {
        static loader: string;
        static observedAttributes: string[];
        readonly for: string;
        readonly path: string;
        connectedCallback(): void;
        attributeChangedCallback(): void;
    }
}
declare namespace WebComponentsManager {
    type HTMLLinkElementRel = "import" | "stylesheet";
    class Link extends Base {
        readonly rel: HTMLLinkElementRel;
    }
}
declare namespace WebComponentsManager {
    class Script extends Base {
    }
}
declare namespace WebComponentsManager {
    class Shell extends Base {
        readonly url: string;
        connectedCallback(): void;
        private bootstrapApplication();
    }
}
