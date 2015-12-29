"use strict";

var path =    require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    "webpack-hot-middleware/client",
    "./src/js/App.jsx"
  ],
  module: {
    loaders: [
      { // babel
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["react", "es2015"]
        }
      },
      { // CSS
        test: /\.css$/,
        loader: "style!css"
      },
      { // SASS
        test: /\.scss$/,
        loader: "style!css!sass"
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  output: {
    path: path.resolve(__dirname, "../public/"),
    publicPath: "/",
    filename: "App.js"
  }
};