"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WebComponentsManifest;
(function (WebComponentsManifest) {
    var Utils;
    (function (Utils) {
        function register(name) {
            return function (target) {
                document["registerElement"](name, { prototype: target.prototype });
            };
        }
        Utils.register = register;
        function fetch(url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            void resolve(request.responseText);
                        }
                        else {
                            void reject(request.responseText);
                        }
                    }
                };
                void request.open("GET", url, true);
                void request.send(null);
            });
        }
        Utils.fetch = fetch;
        function loadManifest(url) {
            var _this = this;
            return fetch(url)
                .then(JSON.parse)
                .then(function (manifest) {
                return (_this.manifest = manifest);
            });
        }
        Utils.loadManifest = loadManifest;
        function importManifest(manifest) {
            var _this = this;
            return Promise.all(manifest.shrinkwrap.map(function (dependency) {
                return importLink(dependency.rel, _this.generateDownloadUrl(dependency.name, "index.html"));
            }));
        }
        Utils.importManifest = importManifest;
        function importLink(rel, href) {
            return new Promise(function (resolve) {
                var link = document.head.querySelector("link[href=\"" + href + "\"]");
                if (!link) {
                    link = document.createElement("link");
                    link.rel = rel;
                    link.href = href;
                    document.head.appendChild(link);
                    link.addEventListener("load", function () { return void resolve(); });
                }
                else {
                    resolve();
                }
            });
        }
        Utils.importLink = importLink;
        function importScript(src) {
            return new Promise(function (resolve) {
                var script = document.head.querySelector("script[src=\"" + src + "\"]");
                if (!script) {
                    script = document.createElement("script");
                    script.src = src;
                    document.head.appendChild(script);
                    script.addEventListener("load", function () { return void resolve(); });
                }
                else {
                    resolve();
                }
            });
        }
        Utils.importScript = importScript;
    })(Utils = WebComponentsManifest.Utils || (WebComponentsManifest.Utils = {}));
    var Shell = (function (_super) {
        __extends(Shell, _super);
        function Shell() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Shell.prototype, "url", {
            get: function () {
                return this.getAttribute("url");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shell.prototype, "for", {
            get: function () {
                return this.getAttribute("for");
            },
            enumerable: true,
            configurable: true
        });
        Shell.prototype.attachedCallback = function () {
            this.bootstrapApplication();
        };
        Shell.prototype.getDependencyMetadata = function (dependencyName) {
            return this.manifest.shrinkwrap.find(function (dependency) { return dependency.name === dependencyName; });
        };
        Shell.prototype.generateDownloadUrl = function (dependencyName, lookup) {
            var dependencyMetadata = this.getDependencyMetadata(dependencyName);
            return (dependencyMetadata.uri || this.manifest.uri)
                .replace("<name>", dependencyName)
                .replace("<version>", dependencyMetadata.name)
                .replace("<lookup>", lookup);
        };
        Shell.prototype.bootstrapApplication = function () {
            var _this = this;
            var shadow = this.attachShadow({ mode: "open" });
            var fragment = document.createDocumentFragment();
            return Promise.resolve(this.url)
                .then(Utils.loadManifest.bind(this))
                .then(Utils.importManifest.bind(this))
                .then(function () {
                fragment.appendChild(document.createElement(_this.for || "slot"));
                shadow.appendChild(fragment);
            });
        };
        return Shell;
    }(HTMLElement));
    Shell = __decorate([
        Utils.register("wcm-shell")
    ], Shell);
    WebComponentsManifest.Shell = Shell;
    var Link = (function (_super) {
        __extends(Link, _super);
        function Link() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Link.prototype, "type", {
            get: function () {
                return this.getAttribute("type");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Link.prototype, "for", {
            get: function () {
                return this.getAttribute("for");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Link.prototype, "lookup", {
            get: function () {
                return this.getAttribute("lookup");
            },
            enumerable: true,
            configurable: true
        });
        Link.prototype.createdCallback = function () {
            this.importDependency();
        };
        Link.prototype.getLocalShell = function () {
            var elem = this;
            while ((elem = elem.parentElement)) {
                if (elem.tagName === "wcm-shell") {
                    return elem;
                }
            }
        };
        Link.prototype.importDependency = function () {
            var downloadUrl = this.getLocalShell().generateDownloadUrl(this.for, this.lookup);
            switch (this.type) {
                case "import":
                case "stylesheet":
                    return void Utils.importLink(this.type, downloadUrl);
                case "script":
                    return void Utils.importScript(downloadUrl);
                default:
                    throw Error("Could download \"" + downloadUrl + "\", unknown type \"" + this.type + "\"");
            }
        };
        return Link;
    }(HTMLElement));
    Link = __decorate([
        Utils.register("wcm-link")
    ], Link);
    WebComponentsManifest.Link = Link;
})(WebComponentsManifest || (WebComponentsManifest = {}));
