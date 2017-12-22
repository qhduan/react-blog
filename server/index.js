"use strict";

import fs from "fs";
import path from "path";

import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

// 初始化文章数据库
import database from "./database.js";
database.init();

let app = express();

import development from "./development.js";

// 调试环境，加载webpack的调试中间件，须在express.static之前
if (process.env.NODE_ENV == "development") {
    development(app);
}

// 配置express
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2mb" }));
app.use(compression());
app.use(express.static(path.join(__dirname, "..", "database")));
app.use(express.static(path.join(__dirname, "..", "public")));

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
    "/create",
    "/update",
    "/update/",
    "/update/:id",
    "/update/:id/",
].forEach(element => {
    app.get(element, (req, res, next) => {
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
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
    const status = err.status || 500;
    res.status(status);
    res.end(`${status} ${err.message}`);
});


const bind = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "config", "bind.json")));

app.listen(bind.port, bind.ip, () => {
    console.log (`listenning on ${bind.port}`);
});
