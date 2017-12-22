"use strict";

var path =    require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    path.resolve(__dirname, "..", "client", "app.js")
  ],
  module: {
      rules: [
          {
              test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif)$/,
              use: "url-loader"
          },
          { // babel
              test: /\.js$/,
              exclude: /node_modules/,
              use: "babel-loader"
          },
          { // .min.js
              test: /\.min\.js$/,
              use: "script-loader"
          },
          { // CSS
              test: /\.css$/,
              use: [
                  "style-loader",
                  "css-loader"
              ]
          },
          { // SASS
              test: /\.(sass|scss)$/,
              use: [
                  "style-loader",
                  "css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
                  "sass-loader"
              ]
          },
      ]
  },
  plugins: [
      new webpack.ProvidePlugin({
          "_": "lodash",
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
