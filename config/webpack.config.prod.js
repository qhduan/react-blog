"use strict";

var path =    require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    path.resolve(__dirname, "..", "client", "app.js")
  ],
  module: {
    loaders: [
      { // babel
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: "babel"
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
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": "\"production\""
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
  ],
  output: {
    path: path.resolve(__dirname, "..", "public/"),
    publicPath: "/",
    filename: "app.js"
  }
};
