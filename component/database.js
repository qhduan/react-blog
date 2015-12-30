"use strict";

import fs from "fs";
import parseArticle from "./parseArticle.js";
import config from "../config/index.js";

/*
 * 测试一个地址path，如果这个地址存在并且是目录就什么都不做，如果这个地址不存在文件，则创建目录
 */
function existsOrMkdir (path) {
  let stat = null;
  try {
    stat = fs.statSync(path);
  } catch (e) { }

  if ( !stat ) {
    try {
      fs.mkdirSync(path);
      stat = fs.statSync(path);
    } catch (e) { }
  }

  if ( !stat || !stat.isDirectory() ) {
    throw new Error(`existsOrMkdir: ${path} Invalid`);
  }
}

/*
 * 读取文章列表，多层选择和循环确实丑了一点
 * 必须要用Sync方法读取，否则可能在Linux同时打开过多文件报错
 */
function readDatabase () {
  let result = [];
  let rDir = "./database/articles";
  let yList = fs.readdirSync(rDir);
  for (let y of yList) {
    let yDir = rDir + `/${y}`;
    if ( y.match(/^\d\d\d\d$/) && fs.statSync(yDir).isDirectory() ) {
      let mList = fs.readdirSync(yDir);
      for (let m of mList) {
        let mDir = yDir + `/${m}`;
        if ( m.match(/^[0-1][0-9]$/) && fs.statSync(mDir).isDirectory() ) {
          let dList = fs.readdirSync(mDir);
          for (let d of dList) {
            let dFile = mDir + `/${d}`;
            if ( d.match(/^\d\d\d\d[0-1][0-9][0-3][0-9]\d\d\.md$/) && fs.statSync(dFile).isFile() ) {
              let data = fs.readFileSync(dFile, "utf8");
              let r = parseArticle(data);
              r.id = d.substr(0, 10);
              result.push(r);
            }
          }
        }
      }
    }
  }
  return result;
}

function exists (path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (path) {
    return false;
  }
}


export default class database {

  static init () {

    existsOrMkdir("./database");
    existsOrMkdir("./database/articles");
    existsOrMkdir("./database/uploads");

    let articles = readDatabase();

    let noContent = articles.map((elem) => {
      return [
        elem.id,
        elem.title,
        elem.date,
        elem.type,
        elem.category
      ];
    });

    fs.writeFileSync( "./database/index.json", JSON.stringify({
      articles: noContent,
      title:     config.title,
      pageCount: config.pageCount
    }), "utf8");

    console.log(`db loaded ${articles.length} articles`);
  }

  static create (title, type, date, category, content) {
    return new Promise((resolve, reject) => {
      const m = date.match(/^(\d{4})-([0-1][0-9])-([0-3][0-9]) ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/);
      const year = m[1];
      const month = m[2];
      const day = m[3];

      existsOrMkdir("./database");
      existsOrMkdir("./database/articles");
      existsOrMkdir(`./database/articles/${year}`);
      existsOrMkdir(`./database/articles/${year}/${month}`);

      let number = 0;
      let getNumber = () => {
        let r = number.toString();
        if (r.length < 2) r = "0" + r;
        return r;
      }

      let id = null;
      let path = null;
      do {
        number++;
        id = year + month + day + getNumber();
        path = `./database/articles/${year}/${month}/${id}.md`;
      } while ( exists(path) );

      try {
        fs.writeFileSync(
          path,
          `title: ${title}\ntype: ${type}\ndate: ${date}\ncategory: ${category}\n---\n\n${content}`,
          "utf8"
        );
        this.init();
        return resolve("Created");
      } catch (e) {
        return reject("File Access Error");
      }
    });
  }

  static update (id, title, type, date, category, content, edit) {
    return new Promise((resolve, reject) => {
      const m = date.match(/^(\d{4})-([0-1]\d)-([0-3]\d) ([0-2]\d):([0-5]\d):([0-5]\d)$/);
      const year = m[1];
      const month = m[2];
      const path = `./database/articles/${year}/${month}/${id}.md`;
      try {
        fs.accessSync(path);
        fs.writeFileSync(
          path,
          `title: ${title}\ntype: ${type}\ndate: ${date}\ncategory: ${category}\nedit: ${edit}\n---\n\n${content}`,
          "utf8"
        );
        this.init();
        return resolve("Updated");
      } catch (e) {
        return reject("File Access Error");
      }
    });
  }

  static remove (id) {
    return new Promise((resolve, reject) => {
      const m = id.match(/^(\d{4})([0-1][0-9])([0-3][0-9])(\d\d)$/);
      const year = m[1];
      const month = m[2];
      const path = `./database/articles/${year}/${month}/${id}.md`;
      try {
        fs.accessSync(path);
        fs.unlinkSync(path);
        this.init();
        return resolve("Removed");
      } catch (e) {
        return reject("File Access Error");
      }
    });
  }

  static upload (name, date, file) {
    return new Promise((resolve, reject) => {
      const m = date.match(/^(\d{4})-([0-1]\d)-([0-3]\d) ([0-2]\d):([0-5]\d):([0-5]\d)$/);
      const year = m[1];
      const month = m[2];

      existsOrMkdir("./database");
      existsOrMkdir("./database/uploads");
      existsOrMkdir(`./database/uploads/${year}`);
      existsOrMkdir(`./database/uploads/${year}/${month}`);

      let path = `./database/uploads/${year}/${month}/${name}`;

      if ( exists(path) ) {
        return reject("File Exists");
      }

      let buf = new Buffer(file, "base64");

      try {
        fs.writeFileSync(path, buf);
        return resolve(path.substr(10)); // 10 = length of "./database"
      } catch (e) {
        return reject("File Writing Error");
      }
    });
  }

};
