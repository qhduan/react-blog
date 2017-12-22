"use strict";

import webpack              from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig        from "../config/webpack.config.dev.js";

export default function development (app) {
    console.log("Development");
    let compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true, // display no info to console (only warnings and errors)
        quiet: false, // display nothing to the console
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
}
