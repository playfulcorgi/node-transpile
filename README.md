# node-transpile

Packages Babel files into runnable Node.js code using [Webpack](https://webpack.js.org/).

## Quickstart

First, add `node-transpile` as a dev dependency to a Node project:
```terminal
npm install --save-dev node-transpile
```

Second, inside package.json, add scripts:
```json
"scripts": {
  "build": "node-transpile build",
  "watch": "node-transpile watch"
}
```

Third, inside package.json set `main`:
```json
"main": "dist/index.js"
```
node-transpile will process src/index.js into dist/index.js.

Since node-transpile uses Babel, it's possible to use a .babelrc file and adjust how it modifies source JS files.

For example:
```json
{
  "presets": ["env", "stage-0"],
  "plugins": [
    "transform-object-rest-spread",
    "transform-class-properties",
    ["babel-plugin-transform-builtin-extend", {
      "globals": ["Error", "Array"]
    }]
  ]
}

```

## Custom Webpack Configuration

Create node-transpile.js, which will export a function. This function will be called by node-transpile to receive a complete Webpack configuration object. As the first parameter, it will receive whatever base configuration node-transpile created for itself.

For example, to add Webpack [aliases](https://webpack.js.org/configuration/resolve/#resolve-alias) for easier module resolution:
```js
const { resolve } = require('path')
const set = require('lodash/set')
const baseDirectoryPath = __dirname
const srcDirectoryPath = resolve(baseDirectoryPath, 'src')

module.exports = (options) => {
  set(options, 'resolve.alias.fu', resolve(srcDirectoryPath, 'functional-utils/'))
  set(options, 'resolve.alias.utils$', resolve(srcDirectoryPath, 'functional-utils/utils.js'))
}
```