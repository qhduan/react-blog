"use strict";

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import compression from "compression";

// 初始化文章数据库
import database from "./component/database.js";
database.init();

let app = express();

// 调试环境，加载webpack的调试中间件，须在express.static之前
if (process.env.NODE_ENV !== "production") {
  console.log("Development");

  let webpack              = require("webpack");
  let webpackDevMiddleware = require("webpack-dev-middleware");
  let webpackHotMiddleware = require("webpack-hot-middleware");
  let webpackConfig        = require("./config/webpack.config.dev");

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

// 配置express
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2mb" }));
app.use(compression());
app.use(express.static(path.join(__dirname, "database")));
app.use(express.static(path.join(__dirname, "public")));

// 文章创建，修改，删除，和文件上传的router
import article from "./routes/article.js";
import upload from "./routes/upload.js";
app.use("/article", article);
app.use("/upload", upload);

// 下面的数组是需要用客户端react-router进行路由的，所以直接转给客户端
[
  "/category/:c/page/:p/",
  "/category/:c/page/:p",
  "/category/:c/",
  "/category/:c",
  "/page/:p/",
  "/page/:p",
  "/view/:id/",
  "/view/:id",
  "/update/:id/",
  "/update/:id",
  "/create/",
  "/create"
].forEach(element => {
  app.get(element, (req, res, next) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });
});

// 404 服务
app.use((req, res, next) => {
  var err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// 500 服务
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.end(`
    message: ${err.message}
  `);
});


let PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log (`listenning on ${PORT}`);
});
