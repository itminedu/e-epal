'use strict';

const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  stats: {
    colors: true,
    reasons: true
  },

  entry: {
    app: './source/app.ts',
    vendor: [
      'core-js',
      'reflect-metadata',
      'zone.js/dist/zone',
      '@angular/platform-browser-dynamic',
      '@angular/core',
      '@angular/common',
      '@angular/router',
      '@angular/http'
     ]
  },

//  output: {
//    path: path.resolve(__dirname, 'dist'),
//    filename: '[name].[hash].bundle.js',
//    publicPath: "/",
//    sourceMapFilename: '[name].[hash].bundle.js.map',
//    chunkFilename: '[id].chunk.js'
//  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'eepal.1.0.bundle.js',
    publicPath: "",
    sourceMapFilename: 'eepal.1.0.bundle.js.map',
    chunkFilename: '1.0.chunk.js'
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },

  plugins: [
//    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].bundle.js'),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new HtmlWebpackPlugin({
      template: './source/index.html',
      inject: 'body',
      minify: false
    }),
    new DashboardPlugin()
  ],

  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint'
    }],
    loaders: [
      { test: /\.ts$/, loaders: ['ts', 'angular2-router-loader'], exclude: /node_modules/ },
      { test: /\.js$/, exclude: [/bower_components/, /node_modules\/@angular\/compiler\/bundles\/.+/], loader: 'babel-loader', query: {presets: ['es2015']} },
      { test: /\.html$/, loader: 'raw' },
//      { test: /\.css$/, loader: 'style-loader!css-loader?sourceMap' },
      { test: /\.css$/, loaders: ['to-string-loader', "style-loader", 'css-loader'] },
      { test: /\.scss$/, loaders: ['to-string-loader', "style-loader", "css-loader", "sass-loader"] },
      { test: /\.svg/, loader: 'url' },
      { test: /\.eot/, loader: 'url' },
      { test: /\.woff/, loader: 'url' },
      { test: /\.woff2/, loader: 'url' },
      { test: /\.ttf/, loader: 'url' },
    ],
    noParse: [ /zone\.js\/dist\/.+/, /angular2\/bundles\/.+/ ]
  },

  devServer: {
    inline: true,
    colors: true,
    contentBase: './dist',
    publicPath: '/'
  }
}
