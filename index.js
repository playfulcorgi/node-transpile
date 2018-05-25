#!/usr/bin/env node
const parseArgs = require('minimist')(process.argv.slice(2))
const webpack = require('webpack')
const { resolve } = require('path')
const PrettyStats = require('./webpack-plugins/PrettyStats')
const ProgressBar = require('./webpack-plugins/ProgressBar')

const shouldWatch = parseArgs._[0] === 'watch'
const baseDirectoryPath = process.cwd()
const packagePath = __dirname

const srcDirectoryPath = resolve(baseDirectoryPath, 'src')
const distDirectoryPath = resolve(baseDirectoryPath, 'dist')
const nodeExternals = require('webpack-node-externals')

const webpackConfiguration = {
  watch: shouldWatch,
  context: baseDirectoryPath,
  plugins: [
    new ProgressBar(),
    new PrettyStats()
  ],
  externals: [
    nodeExternals()
  ],
  entry: {
    index: [
      'babel-polyfill',
      resolve(packagePath, 'babelHelpers.js'),
      resolve(srcDirectoryPath, 'index.js')
    ]
  },
  target: 'node',
  output: {
    path: distDirectoryPath,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: baseDirectoryPath,
        exclude: [
          resolve(baseDirectoryPath, 'node_modules')
        ],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolveLoader: {
    modules: [resolve(packagePath, 'node_modules'), 'node_modules']
  },
  resolve: {
    symlinks: false,
    modules: [
      srcDirectoryPath,
      resolve(packagePath, 'node_modules'), 'node_modules',
      'node_modules'
    ]
  }
}

const customConfigurationContext = require.context(baseDirectoryPath, false, /^node-transpile\.js$/)
let customConfiguration
if (customConfigurationContext.keys().length === 0) {
  customConfiguration = null
} else {
  customConfiguration = customConfigurationContext(
    resolve(baseDirectoryPath, 'node-transpile.js')
  )(webpackConfiguration)
}

const compiler = webpack(webpackConfiguration, () => {
  /* no-op */
})

