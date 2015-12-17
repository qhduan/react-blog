"use strict";

require("babel-register");

let express =           require("express");
let path =              require("path");
let bodyParser =        require("body-parser");
let compression =       require("compression");
let webpackMiddleware = require("webpack-dev-middleware");

let db =                require("./models");

db.init();

let app = express();

if (process.env.NODE_ENV == "development") {
  console.log("Development");

  let webpack              = require("webpack");
  let webpackDevMiddleware = require("webpack-dev-middleware");
  let webpackConfig        = require("./webpack.config");

  delete webpackConfig.plugins;

  let compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    quiet: false,
    stats: {
      colors: true
    }
  }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "database")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/article", require("./routes/article"));


app.use((req, res, next) => {
  var err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});


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
