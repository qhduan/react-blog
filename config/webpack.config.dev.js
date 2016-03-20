"use strict";

var path =    require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    "webpack-hot-middleware/client",
    path.resolve(__dirname, "..", "client", "app.dev.js")
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
          "process.env.NODE_ENV": "\"development\""
      }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
],
  output: {
    path: path.resolve(__dirname, "..", "public/"),
    publicPath: "/",
    filename: "app.js"
  }
};
