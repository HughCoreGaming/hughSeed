"use strict";

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');
var path = require("path");

var mainEntryPoint = path.resolve(__dirname, "app", "app.js");
var publicDirectory = path.resolve(__dirname, "public");
var distDirectory = path.resolve(__dirname, "dist");

module.exports = {
  entry: {
    "hughSeed-main": mainEntryPoint
  },
  plugins: [
    new Webpack.DefinePlugin({
      FIREBASE: "\"" + process.env.hughSeed_FIREBASE + "\"",
      FIREBASEAPIKEY: "\"" + process.env.hughSeed_FIREBASE_APIKEY + "\""
    }),

    new Webpack.optimize.CommonsChunkPlugin({ name: "hughSeed-common", filename: "hughSeed-common.js", minChunks: 2}),

    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname),
      verbose: true,
      dry: false
    })
  ],
  output: {
    path: distDirectory,
    filename: "[name].js"
  },
  devServer: {
    contentBase: publicDirectory,
    port : 8080
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "file"
      },
      {
        test: /\.jpg$/,
        loader: "file"
      },
      { // for third-party minified scripts, don't process require()
        test: /\/xlsx\//,
        include: /(node_modules|bower_components)/,
        loader: "script"
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
      }
    ]
  },
  noInfo: true
};
