import "isomorphic-fetch";
import parseArticle from "../../component/parseArticle.js";
import secret from "../../component/secret.js";

export const REQUEST = "VIEW-REQUEST";
export const RECEIVE = "VIEW-RECEIVE";
export const REMOVING = "VIEW-REMOVING";
export const REMOVED = "VIEW-REMOVED";

function requestData () {
  return {
    type: REQUEST
  };
}

function receiveData (data) {
  return {
    type: RECEIVE,
    data: data
  };
}

export function fetchData (id) {
  const m = id.match(/(\d{4})(\d{2})(\d{4})/);
  const year = m[1];
  const month = m[2];
  return dispatch => {
    dispatch(requestData());
    return fetch(`../articles/${year}/${month}/${id}.md`)
      .then(response => response.text())
      .then(data => parseArticle(data))
      .then(data => dispatch(receiveData(data)));
  };
}

function removingArticle () {
  return {
    type: REMOVING
  };
}

function removedArticle (ret) {
  return {
    type: REMOVED,
    ret:  ret
  };
}

export function removeArticle (id, password) {
  return dispatch => {
    dispatch(removingArticle());
    return fetch("/article/remove", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: secret.encode({ id }, password)
        })
      })
      .then(response => response.json())
      .then(ret => dispatch(removedArticle(ret)));
  };
}
