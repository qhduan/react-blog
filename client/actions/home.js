import "isomorphic-fetch";

export const REQUEST = "HOME-REQUEST";
export const RECEIVE = "HOME-RECEIVE";

function requestData () {
  return {
    type: REQUEST
  }
}

function receiveData (data) {
  return {
    type: RECEIVE,
    data
  }
}

export function fetchData () {
  return dispatch => {
    dispatch(requestData());
    fetch("/index.json")
    .then(response => response.json())
    .then(json => {
      require.ensure([], require => {
        const parseArticle = require("../../component/parseArticle.js");
        const markdown = require("../../component/markdown.js");
        let promies = [];
        for (let p of json.articles) {
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
        .then(() => dispatch(receiveData(json)));
      });
    });
  };
}
