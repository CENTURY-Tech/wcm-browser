"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    function registerComponent(name) {
        return function (target) {
            document["registerElement"](name, { prototype: target.prototype });
        };
    }
    WebComponentsManager.registerComponent = registerComponent;
    var Utils;
    (function (Utils) {
        var whenLoaded = Symbol();
        var manifest = promisifyAssignKey({}, "ref");
        function getManifest() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, manifest.ref];
                        case 1: return [2, _a.sent()];
                    }
                });
            });
        }
        Utils.getManifest = getManifest;
        function setManifest(val) {
            manifest.ref = val;
        }
        Utils.setManifest = setManifest;
        function getDependency(dependencyName) {
            return __awaiter(this, void 0, void 0, function () {
                var dependency;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, getManifest()];
                        case 1:
                            dependency = (_a.sent()).shrinkwrap.find(function (x) { return x.name === dependencyName; });
                            if (!dependency) {
                                console.warn("No dependency was found with the name '%s'", dependencyName);
                            }
                            else {
                                return [2, dependency];
                            }
                            return [2];
                    }
                });
            });
        }
        Utils.getDependency = getDependency;
        function generateDownloadUrl(dependencyName, lookup) {
            return __awaiter(this, void 0, void 0, function () {
                var dependencyMetadata, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!dependencyName) return [3, 1];
                            return [2, /.*\//.exec(this.baseURI)[0] + lookup];
                        case 1: return [4, getDependency(dependencyName)];
                        case 2:
                            dependencyMetadata = _b.sent();
                            _a = dependencyMetadata.uri;
                            if (_a) return [3, 4];
                            return [4, getManifest()];
                        case 3:
                            _a = (_b.sent()).uri;
                            _b.label = 4;
                        case 4: return [2, (_a)
                                .replace("<name>", dependencyMetadata.name)
                                .replace("<version>", dependencyMetadata.version)
                                .replace("<lookup>", lookup || "index.html")];
                    }
                });
            });
        }
        Utils.generateDownloadUrl = generateDownloadUrl;
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
        function importLink(rel, href) {
            var _this = this;
            return Promise.resolve(document.querySelector("link[href=\"" + href + "\"]"))
                .then(function (link) {
                if (href.includes("course-")) {
                    console.log("LOADING  ", href);
                }
                if (!link) {
                    link = document.createElement("link");
                    link.rel = rel;
                    link.href = href;
                    document.head.appendChild(link);
                    promisifyEvent.call(promisifyAssignKey(link, whenLoaded), "load")
                        .then(function () {
                        link[whenLoaded] = link;
                    });
                }
                return link[whenLoaded];
            })
                .then(function (link) {
                if (link.import) {
                    return Promise.all([].map.call(link.import.querySelectorAll("wcm-link, wcm-script"), function (elem) {
                        return elem.whenLoaded;
                    }));
                }
            })
                .then(function () {
                if (href.includes("course-")) {
                    console.log("LOADED ", href);
                }
                _this.whenLoaded = true;
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
                    _this.parentElement.appendChild(script);
                    promisifyEvent.call(promisifyAssignKey(script, whenLoaded), "load")
                        .then(function () {
                        script[whenLoaded] = true;
                    });
                }
                return script[whenLoaded];
            })
                .then(function () {
                _this.whenLoaded = true;
            });
        }
        Utils.importScript = importScript;
        function promisifyEvent(event) {
            var _this = this;
            var handler = function (resolve) { return function (evt) {
                _this.removeEventListener(event, handler);
                resolve(evt);
            }; };
            return new Promise(function (resolve) {
                _this.addEventListener(event, handler(resolve));
            });
        }
        Utils.promisifyEvent = promisifyEvent;
        function promisifyAssignKey(obj, key) {
            var setter;
            var getter = new Promise(function (resolve) {
                setter = function (val) { return (getter = val, setter = function () { return null; }, resolve(val)); };
            });
            return Object.defineProperty(obj, key, { get: function () { return getter; }, set: setter });
        }
        Utils.promisifyAssignKey = promisifyAssignKey;
        function promiseTimeout(ms, promise) {
            var id;
            var timeout = new Promise(function (_resolve, reject) {
                id = setTimeout(function () {
                    reject("Timed out in " + ms + "ms.");
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
        Utils.promiseTimeout = promiseTimeout;
    })(Utils = WebComponentsManager.Utils || (WebComponentsManager.Utils = {}));
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
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
        Object.defineProperty(Base.prototype, "lookup", {
            get: function () {
                return this.getAttribute("lookup");
            },
            enumerable: true,
            configurable: true
        });
        Base.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    WebComponentsManager.Utils.promisifyAssignKey(this, "whenLoaded");
                    return [2];
                });
            });
        };
        return Base;
    }(HTMLElement));
    WebComponentsManager.Base = Base;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
    var Link = Link_1 = (function (_super) {
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
        Link.importTarget = function () {
            var _this = this;
            return WebComponentsManager.Utils.promiseTimeout(30000, WebComponentsManager.Utils.generateDownloadUrl.call(this, this.for, this.lookup)
                .then(function (downloadUrl) {
                return WebComponentsManager.Utils.importLink.call(_this, _this.rel, downloadUrl);
            }))
                .catch(function (err) {
                console.error("%s timeout", _this.for || _this.lookup, err);
            });
        };
        Link.prototype.createdCallback = function () {
            this.init().then(Link_1.importTarget.bind(this));
        };
        return Link;
    }(WebComponentsManager.Base));
    Link = Link_1 = __decorate([
        WebComponentsManager.registerComponent("wcm-link")
    ], Link);
    WebComponentsManager.Link = Link;
    var Link_1;
})(WebComponentsManager || (WebComponentsManager = {}));
var WebComponentsManager;
(function (WebComponentsManager) {
    var Script = Script_1 = (function (_super) {
        __extends(Script, _super);
        function Script() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Script.importTarget = function () {
            var _this = this;
            return WebComponentsManager.Utils.promiseTimeout(30000, Promise.all([].map.call(this.parentElement.querySelectorAll("wcm-link, link"), function (link) {
                if (link.hasOwnProperty("whenLoaded")) {
                    console.log("CUSTOM");
                    return link["whenLoaded"];
                }
                else {
                    console.log("VANILLA");
                    return link["import"] || WebComponentsManager.Utils.promisifyEvent.call(link, "load");
                }
            }))
                .then(function () {
                return WebComponentsManager.Utils.generateDownloadUrl.call(_this, _this.for, _this.lookup);
            })
                .then(function (downloadUrl) {
                return WebComponentsManager.Utils.importScript.call(_this, downloadUrl);
            }))
                .catch(function (err) {
                console.error("%s timeout", _this.for || _this.lookup, err);
            });
        };
        Script.prototype.createdCallback = function () {
            this.init().then(Script_1.importTarget.bind(this));
        };
        return Script;
    }(WebComponentsManager.Base));
    Script = Script_1 = __decorate([
        WebComponentsManager.registerComponent("wcm-script")
    ], Script);
    WebComponentsManager.Script = Script;
    var Script_1;
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
            var shadow = this.attachShadow && this.attachShadow({ mode: "open" }) || this;
            var fragment = document.createDocumentFragment();
            return Promise.resolve(this.url)
                .then(function (url) {
                return WebComponentsManager.Utils.fetch(url).then(JSON.parse);
            })
                .then(function (manifest) {
                WebComponentsManager.Utils.setManifest(manifest);
                if (_this.main) {
                    return WebComponentsManager.Utils.generateDownloadUrl.call(_this, _this.main)
                        .then(function (downloadUrl) {
                        return WebComponentsManager.Utils.importLink.call(_this, "import", downloadUrl);
                    });
                }
            })
                .then(function () {
                fragment.appendChild(document.createElement(_this.firstChild ? "slot" : _this.main));
                shadow.appendChild(fragment);
            });
        };
        return Shell;
    }(HTMLElement));
    Shell = __decorate([
        WebComponentsManager.registerComponent("wcm-shell")
    ], Shell);
    WebComponentsManager.Shell = Shell;
})(WebComponentsManager || (WebComponentsManager = {}));
