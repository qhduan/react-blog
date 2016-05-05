"use strict";

import "isomorphic-fetch";

export const REQUEST = "HOME-REQUEST";
export const RECEIVE = "HOME-RECEIVE";

function requestData () {
  return {
    type: REQUEST
  }
}

function receiveData ({title, posts, articles, page, category, categories, maxPage}) {
  return {
    type: RECEIVE,
    title, posts, articles, page, category, categories, maxPage
  }
}

export function fetchData (page, category) {
  return dispatch => {
    dispatch(requestData());
    fetch("/index.json")
    .then(response => response.json())
    .then(json => {
      require.ensure([], require => {
        const parseArticle = require("../../component/parseArticle.js");
        const markdown = require("../../component/markdown.js");
        let promies = [];
        const title = json.title;
        const pageCount = json.pageCount;
        let articles = json.articles.filter(element => {
          return element[3] == "article";
        });
        let posts = json.articles.filter(element => {
          return element[3] == "post";
        });
        const categories = [[], ...posts].reduce((arr, element) => {
          if (element[4].length && arr.indexOf(element[4]) == -1) {
            arr.push(element[4]);
          }
          return arr;
        });
        const maxPage = Math.ceil(posts.length / pageCount);
        if (category && category.length) {
          posts = posts.filter(e => e[4] == category);
        }
        posts = posts.slice((page - 1) * pageCount, page * pageCount);
        for (let p of posts) {
          (p => {
            const id = p[0];
            const m = id.match(/(\d{4})(\d{2})(\d{4})/);
            const year = m[1];
            const month = m[2];
            promies.push(new Promise(resolve => {
              fetch(`/articles/${year}/${month}/${id}.md`)
              .then(response => response.text())
              .then(data => parseArticle(data))
              .then(data => {
                p[5] = markdown(data.content);
                resolve();
              });
            }));
          })(p);
        }
        Promise.all(promies)
        .then(() => {
          posts.sort((a, b) => {
            if (a[2] > b[2]) return -1;
            else if (a[2] < b[2]) return 1;
            return 0;
          });
          dispatch(receiveData({title, posts, articles, page, category, categories, maxPage}));
        });
      });
    });
  };
}
