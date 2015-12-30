import "isomorphic-fetch";
import parseArticle from "../../component/parseArticle.js";
import secret from "../../component/secret.js";

export const REQUEST = "UPDATE-REQUEST";
export const RECEIVE = "UPDATE-RECEIVE";
export const ATTRIBUTE = "UPDATE-ATTRIBUTE";
export const SUBMITTING = "UPDATE-SUBMITTING";
export const SUBMITTED = "UPDATE-SUBMITTED";

function requestData () {
  return {
    type: REQUEST
  }
}

function receiveData (data) {
  return {
    type: RECEIVE,
    data: data
  }
}

export function fetchData (id) {
  const m = id.match(/(\d{4})(\d{2})(\d{4})/);
  const year = m[1];
  const month = m[2];
  return dispatch => {
    dispatch(requestData());
    return fetch(`/articles/${year}/${month}/${id}.md`)
      .then(response => response.text())
      .then(data => parseArticle(data))
      .then(data => dispatch(receiveData(data)));
  };
}


export function updateAttribute (attribute, value) {
  return {
    type: ATTRIBUTE,
    attribute: attribute,
    value: value
  }
}

function updateSubmitting () {
  return {
    type: SUBMITTING
  };
}

function updateSubmitted (ret) {
  return {
    type: SUBMITTED,
    ret: ret
  };
}

export function updateSubmit ({id, title, type, date, edit, category, content, password}) {
  return dispatch => {
    dispatch(updateSubmitting());
    return fetch("/article/update", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: secret.encode({
            id, title, type, date, edit, category, content
          }, password)
        })
      })
      .then(response => response.json())
      .then(ret => dispatch(updateSubmitted(ret)));
  };
}
