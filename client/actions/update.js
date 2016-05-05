import "isomorphic-fetch";

export const REQUEST = "UPDATE-REQUEST";
export const RECEIVE = "UPDATE-RECEIVE";
export const ATTRIBUTE = "UPDATE-ATTRIBUTE";
export const SUBMITTING = "UPDATE-SUBMITTING";
export const SUBMITTED = "UPDATE-SUBMITTED";
export const UPLOADING = "UPDATE-UPLOADING";
export const UPLOADED = "UPDATE-UPLOADED";

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

export function fetchData (id) {
  const m = id.match(/(\d{4})(\d{2})(\d{4})/);
  const year = m[1];
  const month = m[2];
  return dispatch => {
    dispatch(requestData());
    require.ensure([], require => {
      const parseArticle = require("../../component/parseArticle.js");
      const markdown = require("../../component/markdown.js");
      fetch(`/articles/${year}/${month}/${id}.md`)
      .then(response => response.text())
      .then(data => parseArticle(data))
      .then(data => {
        data.markdowned = markdown(data.content);
        return data;
      })
      .then(data => dispatch(receiveData(data)));
    });
  };
}


export function updateAttribute (attribute, value) {
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
    require.ensure([], require => {
      const secret = require("../../component/secret.js");
      fetch("/article/update", {
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
    });
  };
}

function updateUploading () {
  return {
    type: UPLOADING
  };
}

function updateUploaded (content, markdowned) {
  return {
    type: UPLOADED,
    content, markdowned
  };
}

export function updateUpload ({name, file, date, password}) {
  return dispatch => {
    dispatch(updateUploading());
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
          dispatch(updateUploaded(newContent, markdowned));
        } else {
          console.error("updateUploaded Error");
        }
      });
    });
  }
}
