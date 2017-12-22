"use strict";

import fs from"fs";
import express from "express";
import database from "..//database.js";
import secret from "../../component/secret.js";
import config from "../../config";

let upload = express.Router();

/*
 * 上传文件
 */
upload.post("/", (req, res, next) => {
    let data = secret.decode(req.body.data, config.password);
    if ( !data ) return res.json({ message: "Invalid password" });

    let name = data.name;
    let date = data.date;
    let file = data.file;

    if ( !checkFilename (name) ) return res.json({ message: "Invalid name" });
    if ( !checkDate         (date) ) return res.json({ message: "Invalid date" });
    if ( !checkFile         (file) ) return res.json({ message: "Invalid file" });

    database.upload(name, date, file)
    .then(url => {
        res.json({ success: url });
    })
    .catch(err => {
        res.json({ message: err });
    });
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


export default upload;
