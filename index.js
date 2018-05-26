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

let customConfiguration
try {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  customConfiguration = require(resolve(baseDirectoryPath, 'node-transpile.js'))
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    customConfiguration = null
  } else {
    throw error
  }
}

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

if (customConfiguration !== null) {
  customConfiguration(webpackConfiguration)
}

const compiler = webpack(webpackConfiguration, () => {
  /* no-op */
})

