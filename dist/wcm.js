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
        Shell.prototype.bootstrapApplication = function () {
            var _this = this;
            var shadow = this.attachShadow({ mode: "open" });
            var fragment = document.createDocumentFragment();
            return Promise.resolve(this.url)
                .then(Utils.loadManifest)
                .then(Utils.importManifest)
                .then(function () {
                fragment.appendChild(document.createElement(_this.for || "slot"));
                shadow.appendChild(fragment);
            });
        };
        return Shell;
    }(HTMLElement));
    Shell = __decorate([
        RegisterComponent("wcm-shell")
    ], Shell);
    WebComponentsManifest.Shell = Shell;
    function RegisterComponent(name) {
        return function (target) {
            document.registerElement(name, { prototype: target.prototype });
        };
    }
    WebComponentsManifest.RegisterComponent = RegisterComponent;
    var Utils;
    (function (Utils) {
        function fetchUrl(url) {
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
        Utils.fetchUrl = fetchUrl;
        function loadManifest(url) {
            return fetchUrl(url).then(JSON.parse);
        }
        Utils.loadManifest = loadManifest;
        function importManifest(manifest) {
            return Promise.all(manifest.shrinkwrap.map(function (dependency) {
                return new Promise(function (resolve) {
                    var attrs = {
                        href: (dependency.uri || manifest.uri)
                            .replace("<name>", dependency.name)
                            .replace("<version>", dependency.version)
                            .replace("<lookup>", dependency.lookup),
                        rel: dependency.rel || "import",
                    };
                    var link = document.head.querySelector("link[href=\"" + attrs.href + "\"]");
                    if (!link) {
                        link = document.createElement("link");
                        link.rel = attrs.rel;
                        link.href = attrs.href;
                        document.head.appendChild(link);
                        link.addEventListener("load", function () { return void resolve(); });
                    }
                    else {
                        resolve();
                    }
                });
            }));
        }
        Utils.importManifest = importManifest;
    })(Utils = WebComponentsManifest.Utils || (WebComponentsManifest.Utils = {}));
})(WebComponentsManifest || (WebComponentsManifest = {}));
