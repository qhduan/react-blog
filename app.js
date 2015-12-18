"use strict";

require("babel-register");

let express =     require("express");
let path =        require("path");
let bodyParser =  require("body-parser");
let compression = require("compression");

// 初始化文章数据库
require("./models").init();

let app = express();

// 调试环境，加载webpack的调试中间价
if (process.env.NODE_ENV !== "production") {
  console.log("Development");

  let webpack              = require("webpack");
  let webpackDevMiddleware = require("webpack-dev-middleware");
  let webpackConfig        = require("./config/webpack.config");

  let compiler = webpack(webpackConfig);

  // 关闭plugin，因为uglify太耗时了
  webpackConfig.plugins = [];

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true, // display no info to console (only warnings and errors)
    quiet: false, // display nothing to the console
    stats: {
      colors: true
    }
  }));
}

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2mb" }));
app.use(compression());
app.use(express.static(path.join(__dirname, "database")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/article", require("./routes/article"));
app.use("/upload", require("./routes/upload"));

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


module.exports = () => {
  let PORT = process.env.PORT || 4000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log (`listenning on ${PORT}`);
  });
};
