import "isomorphic-fetch";
import secret from "../../component/secret.js";

export const ATTRIBUTE = "CREATE-ATTRIBUTE";
export const SUBMITTING = "CREATE-SUBMITTING";
export const SUBMITTED = "CREATE-SUBMITTED";
export const UPLOADING = "CREATE-UPLOADING";
export const UPLOADED = "CREATE-UPLOADED";

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

function createUploading () {
  return {
    type: UPLOADING
  };
}

function createUploaded (ret) {
  return {
    type: UPLOADED,
    ret: ret
  };
}

export function createUpload ({name, file, date, password}) {
  return dispatch => {
    dispatch(createUploading());
    return fetch("/upload", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: secret.encode({
            name, file, date
          }, password)
        })
      })
      .then(response => response.json())
      .then(ret => dispatch(createUploaded(ret)));
  }
}
