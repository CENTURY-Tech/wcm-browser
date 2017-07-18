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
        DOM.ready = Symbol();
        function registerComponent(name) {
            return function (target) {
                document["registerElement"](name, { prototype: target.prototype });
            };
        }
        DOM.registerComponent = registerComponent;
        function createElement(tagName, attrs) {
            var elem = document.createElement(tagName);
            for (var key in attrs) {
                elem.setAttribute(key, attrs[key]);
            }
            return elem;
        }
        DOM.createElement = createElement;
        function waitForLink(link) {
            if (link.rel === "stylesheet" && link.style) {
                return Promise.resolve();
            }
            return link.import
                ? Promise.all([].map.call(link.import.querySelectorAll("link"), waitForLink).concat([].map.call(link.import.querySelectorAll("wcm-link, wcm-script"), function (elem) {
                    return Utils.whenDefined(elem, DOM.ready);
                })))
                : promisifyEvent(link, "load").then(function () { return waitForLink(link); });
        }
        DOM.waitForLink = waitForLink;
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
        function getDependencyByName(manifest, name) {
            for (var _i = 0, _a = manifest.shrinkwrap; _i < _a.length; _i++) {
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
                    .then(function (manifest) {
                    var dependency = getDependencyByName(manifest, dependencyName);
                    return (dependency.uri || manifest.uri)
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
        function timeoutPromise(ms, promise) {
            var id;
            var timeout = new Promise(function (_, reject) {
                id = setTimeout(function () {
                    reject("Timed out in " + ms + " ms");
                }, ms);
            });
            return Promise.race([
                promise,
                timeout,
            ]).then(function (result) {
                clearTimeout(id);
                return result;
            });
        }
        Utils.timeoutPromise = timeoutPromise;
        function whenDefined(obj, key) {
            if (!obj.hasOwnProperty(key)) {
                var setter_1;
                var getter_1 = new Promise(function (resolve) {
                    setter_1 = function (val) { return (getter_1 = val, setter_1 = function () { return null; }, resolve(val)); };
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
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.observedAttributes = ["path"];
            return _this;
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
        Base.prototype.createdCallback = function () {
            if (!this[Base.loader]) {
                return;
            }
            if (this.for || this.path) {
                this.attributeChangedCallback();
            }
        };
        Base.prototype.attributeChangedCallback = function () {
            delete this.attributeChangedCallback;
            WebComponentsManager.Utils.timeoutPromise(WebComponentsManager.Utils.timeoutDuration, this[Base.loader]())
                .catch(console.error.bind(null, "Error from '%s': %o", this.for || this.path));
        };
        return Base;
    }(HTMLElement));
    Base.loader = Symbol();
    WebComponentsManager.Base = Base;
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
        Link.prototype[WebComponentsManager.Base.loader] = function () {
            var _this = this;
            return WebComponentsManager.Shrinkwrap.generateDownloadUrl(this, this.for, this.path)
                .then(function (href) {
                var link = document.head.querySelector("link[href=\"" + href + "\"]");
                if (!link) {
                    link = document.head.appendChild(WebComponentsManager.DOM.createElement("link", { rel: _this.rel || "import", href: href }));
                    WebComponentsManager.DOM.waitForLink(link)
                        .then(function () {
                        link[WebComponentsManager.DOM.ready] = true;
                    });
                }
                return WebComponentsManager.Utils.whenDefined(link, WebComponentsManager.DOM.ready);
            })
                .then(function () {
                console.log("LOADED", _this.path);
                _this[WebComponentsManager.DOM.ready] = true;
            });
        };
        return Link;
    }(WebComponentsManager.Base));
    Link = __decorate([
        WebComponentsManager.DOM.registerComponent("wcm-link")
    ], Link);
    WebComponentsManager.Link = Link;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
    var Script = (function (_super) {
        __extends(Script, _super);
        function Script() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Script.prototype[WebComponentsManager.Base.loader] = function () {
            var _this = this;
            return Promise.all([].map.call(this.ownerDocument.querySelectorAll("link"), WebComponentsManager.DOM.waitForLink).concat([].map.call(this.ownerDocument.querySelectorAll("wcm-link"), function (link) {
                return WebComponentsManager.Utils.whenDefined(link, WebComponentsManager.DOM.ready);
            })))
                .then(function () {
                return WebComponentsManager.Shrinkwrap.generateDownloadUrl(_this, _this.for, _this.path);
            })
                .then(function (src) {
                var script = document.body.querySelector("script[src=\"" + src + "\"]");
                if (!script) {
                    script = document.body.appendChild(WebComponentsManager.DOM.createElement("script", { src: src }));
                    WebComponentsManager.DOM.promisifyEvent(script, "load")
                        .then(function () {
                        script[WebComponentsManager.DOM.ready] = true;
                    });
                }
                return WebComponentsManager.Utils.whenDefined(script, WebComponentsManager.DOM.ready);
            })
                .then(function () {
                console.log("LOADED", _this.path);
                _this[WebComponentsManager.DOM.ready] = true;
            });
        };
        return Script;
    }(WebComponentsManager.Base));
    Script = __decorate([
        WebComponentsManager.DOM.registerComponent("wcm-script")
    ], Script);
    WebComponentsManager.Script = Script;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
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
        Shell.prototype.attachedCallback = function () {
            this.bootstrapApplication();
        };
        Shell.prototype.bootstrapApplication = function () {
            var _this = this;
            var shadow = this.attachShadow && this.attachShadow({ mode: "open" }) || this;
            var fragment = document.createDocumentFragment();
            return Promise.resolve(this.url)
                .then(function (url) {
                return WebComponentsManager.Utils.fetchResource(url).then(JSON.parse);
            })
                .then(function (manifest) {
                WebComponentsManager.Shrinkwrap.manifest = manifest;
                if (_this.for || _this.path) {
                    var config = {};
                    if (_this.for) {
                        config.for = _this.for;
                    }
                    if (_this.path) {
                        config.path = _this.path;
                    }
                    return WebComponentsManager.Utils.whenDefined(WebComponentsManager.DOM.createElement("wcm-link", config), WebComponentsManager.DOM.ready);
                    ;
                }
            })
                .then(function () {
                fragment.appendChild(document.createElement(_this.firstChild ? "slot" : _this.for));
                shadow.appendChild(fragment);
            })
                .then(function () {
                _this[WebComponentsManager.DOM.ready] = true;
            });
        };
        return Shell;
    }(WebComponentsManager.Base));
    Shell = __decorate([
        WebComponentsManager.DOM.registerComponent("wcm-shell")
    ], Shell);
    WebComponentsManager.Shell = Shell;
})(WebComponentsManager || (WebComponentsManager = {}));
