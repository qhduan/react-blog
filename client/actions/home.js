import "isomorphic-fetch";

export const REQUEST = "HOME-REQUEST";
export const RECEIVE = "HOME-RECEIVE";

function requestData () {
  return {
    type: REQUEST
  }
}

function receiveData (data, page, category) {
  return {
    type: RECEIVE,
    data, page, category
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
        const pageCount = json.pageCount;
        let articles = json.articles;
        if (category && category.length) {
          articles = articles.filter(e => e[4] == category);
        }
        articles = articles.slice((page - 1) * pageCount, page * pageCount);
        for (let p of articles) {
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
        }
        Promise.all(promies)
        .then(() => dispatch(receiveData(json, page, category)));
      });
    });
  };
}
