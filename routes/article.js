"use strict";

import fs from"fs";
import express from "express";
import database from "../component/database";
import secret from "../component/secret";
import config from "../config";

let article = express.Router();

/*
 * 创建新文章
 */
article.post("/create", (req, res, next) => {
  let data = secret.decode(req.body.data, config.password);
  if ( !data ) return res.json({ message: "Invalid password" });

  let title =    data.title;
  let type =     data.type;
  let date =     data.date;
  let category = data.category;
  let content =  data.content;

  if ( !checkTitle       (title) ) return res.json({ message: "Invalid title" });
  if ( !checkType         (type) ) return res.json({ message: "Invalid type" });
  if ( !checkDate         (date) ) return res.json({ message: "Invalid date" });
  if ( !checkCategory (category) ) return res.json({ message: "Invalid category" });
  if ( !checkContent   (content) ) return res.json({ message: "Invalid content" });

  database.create(title, type, date, category, content)
  .then(ret => {
    res.json({ success: ret });
  })
  .catch(err => {
    res.json({ message: err });
  });
});

/*
 * 修改文章
 */
article.post("/update", (req, res, next) => {
  let data = secret.decode(req.body.data, config.password);
  if ( !data ) return res.json({ message: "Invalid password" });

  let id =       data.id;
  let title =    data.title;
  let type =     data.type;
  let date =     data.date;
  let category = data.category;
  let content =  data.content;
  let edit =     data.edit;

  if ( !checkId             (id) ) return res.json({ message: "Invalid id" });
  if ( !checkTitle       (title) ) return res.json({ message: "Invalid title" });
  if ( !checkType         (type) ) return res.json({ message: "Invalid type" });
  if ( !checkDate         (date) ) return res.json({ message: "Invalid date" });
  if ( !checkCategory (category) ) return res.json({ message: "Invalid category" });
  if ( !checkContent   (content) ) return res.json({ message: "Invalid content" });
  if ( !checkDate         (edit) ) return res.json({ message: "Invalid edit date" });

  database.update(id, title, type, date, category, content, edit)
  .then(ret => {
    res.json({ success: ret });
  })
  .catch(err => {
    res.json({ message: err });
  });
});

/*
 * 删除文章
 */
article.post("/remove", (req, res, next) => {
  let data = secret.decode(req.body.data, config.password);
  if ( !data ) return res.json({ message: "Invalid password" });

  let id = data.id;

  if ( !checkId(id) ) return res.json({ message: "Invalid id" });

  database.remove(id)
  .then(ret => {
    res.json({ success: ret });
  })
  .catch(err => {
    res.json({ message: err });
  });
});

function checkId (id) {
  return typeof id == "string" && id.match(/^(\d{4})([0-1]\d)([0-3]\d)(\d{2})$/);
}

function checkTitle (title) {
  return typeof title == "string" && title.trim().length > 0;
}

function checkType (type) {
  return type == "article" || type == "post";
}

function checkDate (date) {
  return typeof date == "string" && date.match(/^(\d{4})-([0-1]\d)-([0-3]\d) ([0-2]\d):([0-5]\d):([0-5]\d)$/);
}

function checkCategory (category) {
  return typeof category == "string";
}

function checkContent (content) {
  return typeof content == "string" && content.trim().length > 0;
}


export default article;
