#!/usr/bin/env node
const parseArgs = require('minimist')(process.argv.slice(2))
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const shouldWatch = parseArgs._[0] === 'watch'
const webpack = require('webpack')
const { resolve } = require('path')

const baseDirectoryPath = process.cwd()
const packagePath = __dirname

const srcDirectoryPath = resolve(baseDirectoryPath, 'src')
const distDirectoryPath = resolve(baseDirectoryPath, 'dist')
const nodeExternals = require('webpack-node-externals')

const compiler = webpack({
  watch: shouldWatch,
  context: baseDirectoryPath,
  plugins: [
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),
    {
      apply(compiler) {
        compiler.hooks.invalid.tap('compilingMessagePlugin', () => { console.log('Compiling...') })
        compiler.hooks.done.tap('compilingMessagePlugin', (stats) => {
            var rawMessages = stats.toJson({}, true)
            var messages = formatWebpackMessages(rawMessages)
            if (!messages.errors.length && !messages.warnings.length) {
              console.log('Compiled successfully!')
            }
            if (messages.errors.length) {
              console.log('Failed to compile.')
              messages.errors.forEach(e => console.log(e))
              return
            }
            if (messages.warnings.length) {
              console.log('Compiled with warnings.')
              messages.warnings.forEach(w => console.log(w))
            }
          }
        )
      }
    }
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
          resolve(baseDirectoryPath, 'node_modules'),
          resolve(baseDirectoryPath, 'babelHelpers.js')
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
    alias: {
      fu: resolve(srcDirectoryPath, 'functional-utils/'),
      utils$: resolve(srcDirectoryPath, 'functional-utils/utils.js')
    },
    modules: [
      srcDirectoryPath,
      resolve(packagePath, 'node_modules'), 'node_modules',
      'node_modules'
    ]
  }
}, () => { })

