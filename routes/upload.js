"use strict";

let fs      = require("fs");
let express = require("express");
let db =      require("../models");
let secret =  require("../models/secret");
let config =  require("../config");

let router = express.Router();

router.post("/", (req, res, next) => {
  let data = secret.decode(req.body.data, config.password);
  if ( !data ) return res.json({ message: "Invalid password" });

  let name = data.name;
  let date = data.date;
  let file = data.file;

  if ( !checkFilename (name) ) return res.json({ message: "Invalid name" });
  if ( !checkDate     (date) ) return res.json({ message: "Invalid date" });
  if ( !checkFile     (file) ) return res.json({ message: "Invalid file" });

  let ret = db.upload(name, date, file);
  if ( !ret ){
    return res.json({ message: "Invalid upload" });
  }
  res.json({ success: ret });

});

function checkFilename (name) {
  return name.trim().length > 0;
}

function checkDate (date) {
  return typeof date == "string" && date.match(/^(\d{4})-([0-1]\d)-([0-3]\d) ([0-2]\d):([0-5]\d):([0-5]\d)$/);
}

function checkFile (file) {
  return file.trim().length > 0;
}


module.exports = router;
