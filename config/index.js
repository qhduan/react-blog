"use strict";

let fs = require("fs");


let config = null;

try {
  config = fs.readFileSync("./config/config.json", "utf8");
  config = JSON.parse(config);
} catch (e) {
  config = {
    title:     "Blog Title",
    pageCount: 6,
    password:  "admin"
  };
  fs.writeFileSync("./config/config.json",
    JSON.stringify(config, null, 4),
    "utf8");
}


export default config;
