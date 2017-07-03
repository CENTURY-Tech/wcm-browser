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
    function registerComponent(name) {
        return function (target) {
            document["registerElement"](name, { prototype: target.prototype });
        };
    }
    WebComponentsManifest.registerComponent = registerComponent;
})(WebComponentsManifest || (WebComponentsManifest = {}));
var WebComponentsManifest;
(function (WebComponentsManifest) {
    var Link = (function (_super) {
        __extends(Link, _super);
        function Link() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Link.prototype, "rel", {
            get: function () {
                return this.getAttribute("rel");
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
        Link.prototype.importDependency = function () {
            var _this = this;
            WebComponentsManifest.Utils.importLink.call(this, this.rel, WebComponentsManifest.Utils.generateDownloadUrl.call(this, this.for, this.lookup))
                .then(function () { return (_this.loaded = true); });
        };
        return Link;
    }(HTMLElement));
    Link = __decorate([
        WebComponentsManifest.registerComponent("wcm-link")
    ], Link);
    WebComponentsManifest.Link = Link;
})(WebComponentsManifest || (WebComponentsManifest = {}));
var WebComponentsManifest;
(function (WebComponentsManifest) {
    var Script = (function (_super) {
        __extends(Script, _super);
        function Script() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Script.prototype, "for", {
            get: function () {
                return this.getAttribute("for");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Script.prototype, "lookup", {
            get: function () {
                return this.getAttribute("lookup");
            },
            enumerable: true,
            configurable: true
        });
        Script.prototype.createdCallback = function () {
            this.importScript();
        };
        Script.prototype.importScript = function () {
            var _this = this;
            Promise.all([].map.call(this.parentElement.querySelectorAll("wcm-link"), function (link) {
                return !link.loaded && WebComponentsManifest.Utils.promisifyEvent.call(link, "load");
            }))
                .then(function () {
                WebComponentsManifest.Utils.importScript.call(_this, WebComponentsManifest.Utils.generateDownloadUrl.call(_this, _this.for, _this.lookup));
            });
        };
        return Script;
    }(HTMLElement));
    Script = __decorate([
        WebComponentsManifest.registerComponent("wcm-script")
    ], Script);
    WebComponentsManifest.Script = Script;
})(WebComponentsManifest || (WebComponentsManifest = {}));
var WebComponentsManifest;
(function (WebComponentsManifest) {
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
        Object.defineProperty(Shell.prototype, "main", {
            get: function () {
                return this.getAttribute("main");
            },
            enumerable: true,
            configurable: true
        });
        Shell.prototype.attachedCallback = function () {
            this.bootstrapApplication();
        };
        Shell.prototype.bootstrapApplication = function () {
            var _this = this;
            var shadow = this.attachShadow({ mode: "open" });
            var fragment = document.createDocumentFragment();
            return Promise.resolve(this.url)
                .then(function (url) {
                return WebComponentsManifest.Utils.fetch(url).then(JSON.parse);
            })
                .then(function (manifest) {
                WebComponentsManifest.Utils.setManifest(manifest);
                return WebComponentsManifest.Utils.importLink.call(_this, "import", WebComponentsManifest.Utils.generateDownloadUrl.call(_this, manifest.main));
            })
                .then(function () {
                fragment.appendChild(document.createElement(_this.firstChild ? "slot" : _this.main));
                shadow.appendChild(fragment);
            });
        };
        return Shell;
    }(HTMLElement));
    Shell = __decorate([
        WebComponentsManifest.registerComponent("wcm-shell")
    ], Shell);
    WebComponentsManifest.Shell = Shell;
})(WebComponentsManifest || (WebComponentsManifest = {}));
var WebComponentsManifest;
(function (WebComponentsManifest) {
    var Utils;
    (function (Utils) {
        var manifest;
        function setManifest(val) {
            manifest = val;
        }
        Utils.setManifest = setManifest;
        function getManifest() {
            return manifest;
        }
        Utils.getManifest = getManifest;
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
        function getDependency(dependencyName) {
            var dependency = manifest.shrinkwrap.find(function (dependency) { return dependency.name === dependencyName; });
            if (!dependency) {
                console.warn("No dependency was found with the name '%s'", dependencyName);
            }
            else {
                return dependency;
            }
        }
        Utils.getDependency = getDependency;
        function generateDownloadUrl(dependencyName, lookup) {
            if (!dependencyName) {
                return /.*\//.exec(this.baseURI)[0] + lookup;
            }
            else {
                var dependencyMetadata = getDependency(dependencyName);
                return (dependencyMetadata.uri || manifest.uri)
                    .replace("<name>", dependencyMetadata.name)
                    .replace("<version>", dependencyMetadata.version)
                    .replace("<lookup>", lookup || "index.html");
            }
        }
        Utils.generateDownloadUrl = generateDownloadUrl;
        function promisifyEvent(event) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.addEventListener(event, function (evt) { return resolve(evt); });
            });
        }
        Utils.promisifyEvent = promisifyEvent;
        function importLink(rel, href) {
            var _this = this;
            return Promise.resolve(document.querySelector("link[href=\"" + href + "\"]"))
                .then(function (link) {
                if (!link) {
                    link = document.createElement("link");
                    link.rel = rel;
                    link.href = href;
                    document.head.appendChild(link);
                    return promisifyEvent.call(link, "load");
                }
            })
                .then(function () {
                try {
                    _this.dispatchEvent(new Event("load"));
                }
                catch (err) { }
            });
        }
        Utils.importLink = importLink;
        function importScript(src) {
            var _this = this;
            return Promise.resolve(document.head.querySelector("script[src=\"" + src + "\"]"))
                .then(function (script) {
                if (!script) {
                    script = document.createElement("script");
                    script.src = src;
                    document.head.appendChild(script);
                    return promisifyEvent.call(script, "load");
                }
            })
                .then(function () {
                try {
                    _this.dispatchEvent(new Event("load"));
                }
                catch (err) { }
            });
        }
        Utils.importScript = importScript;
    })(Utils = WebComponentsManifest.Utils || (WebComponentsManifest.Utils = {}));
})(WebComponentsManifest || (WebComponentsManifest = {}));
