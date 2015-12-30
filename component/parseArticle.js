"use strict";

/*

文章格式：

title: 文章标题
type: 文章类型，post或者article
date: 2010-10-10 10:10:10
category: 文章类别
edit: 可选，最后更新日期
---

文章正文，准确来说，---\n\n之后的内容都应该是正文

*/
export default function parseArticle (data) {
  var splitor = "---";
  var pos = data.indexOf(splitor);

  if (pos == -1) {
    throw new Error("parse: file have not splitor");
  }

  var header = data.substr(0, pos);
  var content = data.substr(pos + splitor.length).trim();

  var elem = {};
  elem.title = header.match(/title:\ ([^\0\n]+)\n/);
  elem.date = header.match(/date:\ ([^\0\n]+)\n/);
  if (!elem.title || !elem.date) { throw new Error("parse: file title/date can't be parsed"); }
  elem.title = elem.title[1];
  elem.date = elem.date[1];

  var date = elem.date.match(/^(\d{4})-([0-1]\d)-([0-3]\d) ([0-2]\d):([0-5]\d):([0-5]\d)$/);
  if (!date) { throw new Error("parse: file date can't be parsed"); }

  elem.type = header.match(/type:\ ([^\0\n]+)\n/);
  if (elem.type) {
    elem.type = elem.type[1];
    if (elem.type == "post") {
      elem.type = "post";
    } else if (elem.type == "article") {
      elem.type = "article";
    } else {
      console.error(elem.type);
      throw new Error("parse: file type wrong");
    }
  } else {
    elem.type = "post";
  }

  elem.category = header.match(/category:\ ([^\0\n]+)\n/);
  if (elem.category) {
    elem.category = elem.category[1];
  } else {
    elem.category = "";
  }

  elem.edit = header.match(/edit:\ ([^\0\n]+)\n/);
  if (elem.edit) {
    elem.edit = elem.edit[1];
  } else {
    elem.edit = "";
  }

  elem.content = content;
  return elem;
};
