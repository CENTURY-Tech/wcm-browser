"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
window.addEventListener("WebComponentsReady", function () {
    var WcmUtils = (function (_super) {
        __extends(WcmUtils, _super);
        function WcmUtils() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(WcmUtils.prototype, "noop", {
            get: function () {
                return function () { };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WcmUtils.prototype, "manifestLoadingError", {
            get: function () {
                return function () {
                    throw Error("Failed to load manifest");
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WcmUtils.prototype, "manifestNotLoadedError", {
            get: function () {
                return function () {
                    throw Error("Manifest not loaded");
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WcmUtils.prototype, "componentNotAvaliableError", {
            get: function () {
                return function () {
                    throw Error("Component not available");
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WcmUtils.prototype, "componentLoadingError", {
            get: function () {
                return function () {
                    throw Error("Failed to load component");
                };
            },
            enumerable: true,
            configurable: true
        });
        WcmUtils.prototype.fetch = function (url) {
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
        };
        WcmUtils.prototype.removeComponent = function (scope) {
            void scope.remove();
        };
        WcmUtils = __decorate([
            component("wcm-utils")
        ], WcmUtils);
        return WcmUtils;
    }(polymer.Base));
    WcmUtils.register();
});

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
window.addEventListener("WebComponentsReady", function () {
    var manifestRef;
    var loadedElements = [];
    var WcmService = (function (_super) {
        __extends(WcmService, _super);
        function WcmService() {
            _super.apply(this, arguments);
        }
        WcmService.prototype.ready = function () {
            this.wcmUtils = document.createElement("wcm-utils");
        };
        WcmService.prototype.getManifest = function () {
            return manifestRef;
        };
        WcmService.prototype.setManifest = function (manifest) {
            manifestRef = manifest;
        };
        WcmService.prototype.importComponent = function (name) {
            this.checkManifestIsLoaded();
            this.checkComponentIsDefined(name);
            return this._importComponent(name);
        };
        WcmService.prototype.importComponents = function () {
            var _this = this;
            var names = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                names[_i - 0] = arguments[_i];
            }
            this.checkManifestIsLoaded();
            for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
                var name_1 = names_1[_a];
                this.checkComponentIsDefined(name_1);
            }
            return Promise.all(names.map(function (x) { return _this._importComponent(x); }));
        };
        WcmService.prototype.checkManifestIsLoaded = function () {
            if (!manifestRef) {
                void this.wcmUtils.manifestNotLoadedError();
            }
        };
        WcmService.prototype.checkComponentIsDefined = function (name) {
            if (!manifestRef.shrinkwrap.hasOwnProperty(name)) {
                void this.wcmUtils.componentNotAvaliableError();
            }
        };
        WcmService.prototype._importComponent = function (name) {
            var _this = this;
            if (loadedElements.indexOf(name) > -1) {
                return Promise.resolve();
            }
            return new Promise(function (resolve) {
                void _this.importHref(_this.getManifest().shrinkwrap[name], function () {
                    void loadedElements.push(name);
                    void resolve();
                }, _this.wcmUtils.componentLoadingError);
            });
        };
        WcmService = __decorate([
            component("wcm-service")
        ], WcmService);
        return WcmService;
    }(polymer.Base));
    WcmService.register();
});

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
window.addEventListener("WebComponentsReady", function () {
    var WcmLink = (function (_super) {
        __extends(WcmLink, _super);
        function WcmLink() {
            _super.apply(this, arguments);
        }
        WcmLink.prototype.ready = function () {
            this.wcmService = document.createElement("wcm-service");
            this.wcmUtils = document.createElement("wcm-utils");
        };
        WcmLink.prototype.attached = function () {
            var _this = this;
            if (!this.for) {
                throw new Error("Component name must be provided");
            }
            void this.wcmService.importComponent(this.for).finally(function () { return void _this.wcmUtils.removeComponent(_this); });
        };
        __decorate([
            property({ type: String })
        ], WcmLink.prototype, "for", void 0);
        WcmLink = __decorate([
            component("wcm-link")
        ], WcmLink);
        return WcmLink;
    }(polymer.Base));
    WcmLink.register();
});

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
window.addEventListener("WebComponentsReady", function () {
    var WcmShell = (function (_super) {
        __extends(WcmShell, _super);
        function WcmShell() {
            _super.apply(this, arguments);
        }
        WcmShell.prototype.ready = function () {
            this.wcmService = document.createElement("wcm-service");
            this.wcmUtils = document.createElement("wcm-utils");
        };
        WcmShell.prototype.attached = function () {
            var _this = this;
            this.ensureManifest(this.url).then(function () {
                if (_this.loadAll) {
                    void _this.loadAllChildDependencies().then(function () { return void _this.bootstrapRootComponent(); }, _this.wcmUtils.noop);
                }
                else {
                    void _this.loadRequiredDependencies().then(function () { return void _this.bootstrapRootComponent(); }, _this.wcmUtils.noop);
                }
            }, this.wcmUtils.manifestLoadingError);
        };
        WcmShell.prototype.ensureManifest = function (url) {
            var _this = this;
            if (this.wcmService.getManifest()) {
                return Promise.resolve();
            }
            return this.wcmUtils.fetch(url).then(function (manifestStr) {
                void _this.wcmService.setManifest(JSON.parse(manifestStr));
            }, this.wcmUtils.manifestLoadingError);
        };
        WcmShell.prototype.loadRequiredDependencies = function (forComponent) {
            forComponent = forComponent || this.resolveShellComponent();
            return (_a = this.wcmService).importComponents.apply(_a, [forComponent].concat(this.resolveComponentDependencies(forComponent, false)));
            var _a;
        };
        WcmShell.prototype.loadAllChildDependencies = function (forComponent) {
            forComponent = forComponent || this.resolveShellComponent();
            return (_a = this.wcmService).importComponents.apply(_a, [forComponent].concat(this.resolveComponentDependencies(forComponent, true)));
            var _a;
        };
        WcmShell.prototype.bootstrapRootComponent = function () {
            void Polymer.dom(this).parentNode.replaceChild(document.createElement(this.resolveShellComponent()), this);
        };
        WcmShell.prototype.resolveShellComponent = function () {
            return this.for || this.wcmService.getManifest().root;
        };
        WcmShell.prototype.resolveComponentDependencies = function (forComponent, recursive) {
            var dependencies = [];
            for (var _i = 0, _a = this.wcmService.getManifest().graph[forComponent]; _i < _a.length; _i++) {
                var dependency = _a[_i];
                if (recursive) {
                    dependencies.push.apply(dependencies, [dependency].concat(this.resolveComponentDependencies(dependency, recursive)));
                }
                else {
                    dependencies.push(dependency);
                }
            }
            return dependencies.filter(function (x) { return x !== forComponent; });
        };
        __decorate([
            property({ type: String })
        ], WcmShell.prototype, "for", void 0);
        __decorate([
            property({ type: String, value: "./manifest.json" })
        ], WcmShell.prototype, "url", void 0);
        __decorate([
            property({ type: Boolean })
        ], WcmShell.prototype, "loadAll", void 0);
        WcmShell = __decorate([
            component("wcm-shell")
        ], WcmShell);
        return WcmShell;
    }(polymer.Base));
    WcmShell.register();
});
