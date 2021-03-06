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
var WebComponentsManager;
(function (WebComponentsManager) {
    var DOM;
    (function (DOM) {
        DOM.ready = "__ready";
        function createElement(tagName, attrs) {
            var elem = document.createElement(tagName);
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    elem.setAttribute(key, attrs[key]);
                }
            }
            return elem;
        }
        DOM.createElement = createElement;
        function registerComponent(name) {
            return function (target) {
                Utils.whenDefined(window, "customElements").then(function (customElements) {
                    customElements.define(name, target);
                });
            };
        }
        DOM.registerComponent = registerComponent;
        function promisifyEvent(target, event) {
            var handler = function (resolve) {
                return function (evt) {
                    target.removeEventListener(event, handler);
                    resolve(evt);
                };
            };
            return new Promise(function (resolve) {
                handler = handler(resolve);
                target.addEventListener(event, handler);
            });
        }
        DOM.promisifyEvent = promisifyEvent;
    })(DOM = WebComponentsManager.DOM || (WebComponentsManager.DOM = {}));
    var Shrinkwrap;
    (function (Shrinkwrap) {
        function getDependencyByName(config, name) {
            for (var _i = 0, _a = config.shrinkwrap; _i < _a.length; _i++) {
                var dependency = _a[_i];
                if (dependency.name === name) {
                    return dependency;
                }
            }
            throw Error("No dependency was found with the name '" + name + "'");
        }
        function generateDownloadUrl(target, dependencyName, path) {
            if (!dependencyName) {
                return Promise.resolve(/http(s)?:\/\//.test(path)
                    ? path
                    : /.*\//.exec(target.baseURI)[0] + path);
            }
            else {
                return Utils.whenDefined(Shrinkwrap, "manifest")
                    .then(function (config) {
                    var dependency = getDependencyByName(config, dependencyName);
                    return document.baseURI + (dependency.uri || config.uri)
                        .replace("<name>", dependency.name)
                        .replace("<version>", dependency.version)
                        .replace("<path>", path || "index.html");
                });
            }
        }
        Shrinkwrap.generateDownloadUrl = generateDownloadUrl;
    })(Shrinkwrap = WebComponentsManager.Shrinkwrap || (WebComponentsManager.Shrinkwrap = {}));
    var Utils;
    (function (Utils) {
        Utils.timeoutDuration = 30000;
        function fetchResource(url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            resolve(request.responseText);
                        }
                        else {
                            reject(request.responseText);
                        }
                    }
                };
                request.open("GET", url, true);
                request.send(null);
            });
        }
        Utils.fetchResource = fetchResource;
        function whenDefined(obj, key) {
            if (!obj.hasOwnProperty(key)) {
                var setter_1;
                var getter_1 = new Promise(function (resolve) {
                    setter_1 = function (val) {
                        getter_1 = val;
                        setter_1 = function () { return null; };
                        resolve(val);
                    };
                });
                Object.defineProperty(obj, key, { get: function () { return getter_1; }, set: setter_1 });
            }
            return Promise.resolve(obj[key]);
        }
        Utils.whenDefined = whenDefined;
    })(Utils = WebComponentsManager.Utils || (WebComponentsManager.Utils = {}));
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
    var load = "__load";
    var loader = "__loader";
    var elements = {};
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Base.prototype, "for", {
            get: function () {
                return this.getAttribute("for");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Base.prototype, "path", {
            get: function () {
                return this.getAttribute("path");
            },
            enumerable: true,
            configurable: true
        });
        Base.prototype[load] = function (context) {
            var _this = this;
            WebComponentsManager.Shrinkwrap.generateDownloadUrl(this, this.for, this.path)
                .then(function (href) {
                if (elements[href]) {
                    return elements[href];
                }
                else {
                    return elements[href] = _this[Base.loader](context, href);
                }
            })
                .then(function () {
                _this[WebComponentsManager.DOM.ready] = true;
            });
        };
        Base.load = load;
        Base.loader = loader;
        return Base;
    }(HTMLElement));
    WebComponentsManager.Base = Base;
    Base.prototype.constructor = Base;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
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
        Link.prototype[WebComponentsManager.Base.loader] = function (_context, href) {
            var link = document.head.appendChild(WebComponentsManager.DOM.createElement("link", { rel: this.rel || "import", href: href }));
            return WebComponentsManager.DOM.promisifyEvent(link, "load").then(function () {
                return Promise.all([].map.call(link.import.querySelectorAll("wcm-link, wcm-script"), function (elem) {
                    elem[WebComponentsManager.Base.load](link.import);
                    return WebComponentsManager.Utils.whenDefined(elem, WebComponentsManager.DOM.ready);
                }));
            });
        };
        Link = __decorate([
            WebComponentsManager.DOM.registerComponent("wcm-link")
        ], Link);
        return Link;
    }(WebComponentsManager.Base));
    WebComponentsManager.Link = Link;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
    var Script = (function (_super) {
        __extends(Script, _super);
        function Script() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Script.prototype[WebComponentsManager.Base.loader] = function (context, src) {
            return Promise.all([].map.call(context.querySelectorAll("wcm-link"), function (link) {
                return WebComponentsManager.Utils.whenDefined(link, WebComponentsManager.DOM.ready);
            })).then(function () {
                return WebComponentsManager.DOM.promisifyEvent(document.body.appendChild(WebComponentsManager.DOM.createElement("script", { src: src })), "load");
            });
        };
        Script = __decorate([
            WebComponentsManager.DOM.registerComponent("wcm-script")
        ], Script);
        return Script;
    }(WebComponentsManager.Base));
    WebComponentsManager.Script = Script;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
    var Shell = (function (_super) {
        __extends(Shell, _super);
        function Shell() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Shell.prototype, "context", {
            get: function () {
                return document;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shell.prototype, "url", {
            get: function () {
                return this.getAttribute("url");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shell.prototype, "disableShadow", {
            get: function () {
                return this.hasAttribute("disable-shadow");
            },
            enumerable: true,
            configurable: true
        });
        Shell.prototype.connectedCallback = function () {
            this.bootstrapApplication();
        };
        Shell.prototype.bootstrapApplication = function () {
            var _this = this;
            var container = this.disableShadow ? this : this.attachShadow && this.attachShadow({ mode: "open" }) || this;
            return Promise.resolve(this.url)
                .then(function (url) {
                return WebComponentsManager.Utils.fetchResource(url).then(JSON.parse);
            })
                .then(function (manifest) {
                WebComponentsManager.Shrinkwrap.manifest = manifest;
                if (!_this.disableShadow) {
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(document.createElement("slot"));
                    container.appendChild(fragment);
                }
                return Promise.all([].map.call(_this.querySelectorAll("wcm-link, wcm-script"), (function (elem) {
                    elem[WebComponentsManager.Base.load](document);
                    return WebComponentsManager.Utils.whenDefined(elem, WebComponentsManager.DOM.ready);
                })));
            })
                .then(function () {
                _this[WebComponentsManager.DOM.ready] = true;
            });
        };
        Shell = __decorate([
            WebComponentsManager.DOM.registerComponent("wcm-shell")
        ], Shell);
        return Shell;
    }(WebComponentsManager.Base));
    WebComponentsManager.Shell = Shell;
})(WebComponentsManager || (WebComponentsManager = {}));
