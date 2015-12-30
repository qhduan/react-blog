import "isomorphic-fetch";
import secret from "../../component/secret.js";

export const ATTRIBUTE = "CREATE-ATTRIBUTE";
export const SUBMITTING = "CREATE-SUBMITTING";
export const SUBMITTED = "CREATE-SUBMITTED";

export function createAttribute (attribute, value) {
  return {
    type: ATTRIBUTE,
    attribute: attribute,
    value: value
  }
}

function createSubmitting () {
  return {
    type: SUBMITTING
  };
}

function createSubmitted (ret) {
  return {
    type: SUBMITTED,
    ret: ret
  };
}

export function createSubmit ({title, type, date, category, content, password}) {
  return dispatch => {
    dispatch(createSubmitting());
    return fetch("/article/create", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: secret.encode({
            title, type, date, category, content
          }, password)
        })
      })
      .then(response => response.json())
      .then(ret => dispatch(createSubmitted(ret)));
  };
}
