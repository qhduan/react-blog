"use strict";

let fs = require("fs");


let config = null;

try {
  config = fs.readFileSync("./config/config.json", "utf8");
} catch (e) {
  config = {
    title:     "Blog Title",
    pageCount: 10,
    password:  "admin"
  };
  fs.writeFileSync("./config/config.json", JSON.stringify(config, null, 4), "utf8");
}

if (typeof config == "string") {
  config = JSON.parse(config);
}


module.exports = {
  title:     config.title,
  pageCount: config.pageCount,
  password:  config.password
};
