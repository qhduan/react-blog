"use strict";

import "isomorphic-fetch";

export const ATTRIBUTE = "CREATE-ATTRIBUTE";
export const SUBMITTING = "CREATE-SUBMITTING";
export const SUBMITTED = "CREATE-SUBMITTED";
export const UPLOADING = "CREATE-UPLOADING";
export const UPLOADED = "CREATE-UPLOADED";
export const ERROR = "CREATE-ERROR";

export function createAttribute (attribute, value, markdowned) {
  return dispatch => {
    require.ensure([], require => {
      const markdown = require("../../component/markdown.js");
      let data = {
        type: ATTRIBUTE,
        attribute,
        value
      };
      if (attribute == "content") {
        data.markdowned = markdown(value);
      }
      dispatch(data);
    });
  };
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
    require.ensure([], require => {
      const secret = require("../../component/secret.js");
      fetch("/article/create", {
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
    });
  };
}

function createUploading () {
  return {
    type: UPLOADING
  };
}

function createUploaded (content, markdowned) {
  return {
    type: UPLOADED,
    content, markdowned
  };
}

export function createUpload ({name, file, date, password, content}) {
  return dispatch => {
    dispatch(createUploading());
    require.ensure([], require => {
      const secret = require("../../component/secret.js");
      const markdown = require("../../component/markdown.js");
      fetch("/upload", {
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
      .then(ret => {
        if (ret.success) {
          const url = ret.success;
          let add = `[${url}](${url})`;
          if (url.match(/\.jpg$|\.png$|\.gif$|\.bmp$/ig)) {
            add = "!" + add;
          }
          const newContent = `${content}\n\n${add}\n\n`;
          const markdowned = markdown(newContent);
          dispatch(createUploaded(newContent, markdowned));
        } else {
          console.error("createUpload Error");
        }
      });
    });
  }
}
