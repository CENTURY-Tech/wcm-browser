# Web Components Manifest

Clear cut dependency management for Web Components

[![npm](https://img.shields.io/npm/v/@ctek/wcm.svg?style=flat-square)](https://www.npmjs.com/package/@ctek/wcm)

### Project description
This library aims to improve the way we deploy and push updates to applications by enabling developers to defer user impacting changes without impeding development, and minimise cache invalidation wherever possible. It aims tp address two key issues in the way we manage Web based projects today...

- With the advent of Web Components, applications and their dependencies are quickly becoming hard to maintain as they grow. For example, a small change in a child component with uncontrolled dependencies can lead to breaking changes in the consuming application that are hard to debug.

- For projects that are bundled into a single file, making even the smallest of changes means that the user must load the entire source from scratch. This can be an expensive process, and is not future compatible with the arrival of HTTP/2.0 and similar protocols in most modern browsers.

With WCM, applications have explicitly defined dependencies that are resolved at runtime using the `<wcm-shell>` tag. These dependencies may be loaded fully before the application is bootstrapped, or deferred until actually required.

This allows for continuous releases of a given dependency component, without affecting the end user.

### Notes about usage
This library currently relies on [Polymer](https://github.com/Polymer/polymer), [PolymerTS](https://github.com/nippur72/PolymerTS), and [WebComponents.js](https://github.com/webcomponents/webcomponentsjs). It's important that they are all loaded before loading WCM, meaning that the head of your index file should include something similar to this:

```html
<!-- Shim Web Components -->
<script src="path/to/packages/.../webcomponentsjs/webcomponents-lite.js"></script>

<!-- Load Polymer and the TS decorators -->
<link rel="import" href="path/to/packages/.../polymer/polymer.html">
<link rel="import" href="path/to/packages/.../polymer-ts/polymer-ts.html">

<!-- Load WCM -->
<script src="path/to/packages/.../wcm.js"></script>
```
