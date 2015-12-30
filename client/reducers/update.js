import { UPDATE_PATH } from "redux-simple-router";

import {
  REQUEST,
  RECEIVE,
  ATTRIBUTE,
  SUBMITTING,
  SUBMITTED,
  UPLOADING,
  UPLOADED  } from "../actions/update.js";

import parseArticle from "../../component/parseArticle.js";
import markdown from "../../component/markdown.js";

const initialState = {
  data: {},
  isFetching: false,
  alertMsg: "",
  id: "",
  title: "",
  type: "post",
  date: "",
  edit: new Date().toJSON().substr(0, 19).replace("T", " "),
  category: "",
  content: "",
  view: "",
  password: ""
};

function updateReceive (state, action) {
  let data = action.data;
  return Object.assign({}, state, {
    data:       data,
    isFetching: false,
    title:      data.title,
    type:       data.type,
    date:       data.date,
    category:   data.category,
    content:    data.content,
    view:       markdown(data.content)
  });
}

export default function update (state = initialState, action) {
  let data = {};
  switch (action.type) {
    case REQUEST:
      data.isFetching = true;
      return Object.assign({}, state, data);
    case RECEIVE:
      return updateReceive(state, action);
    case ATTRIBUTE:
      if (action.attribute == "content") {
        data.content = action.value;
        data.view = markdown(action.value);
      } else {
        data[action.attribute] = action.value;
      }
      return Object.assign({}, state, data);
    case SUBMITTING:
      data.isFetching = true;
      return Object.assign({}, state, data);
    case SUBMITTED:
      data.isFetching = false;
      data.alertMsg = (action.ret.success || action.ret.message || "Unknown Error") + `[${Date.now()}]`;
      return Object.assign({}, state, data);
    case UPLOADING:
      data.isFetching = true;
      return Object.assign({}, state, data);
    case UPLOADED:
      data.isFetching = false;
      if (action.ret.success) {
        const url = action.ret.success;
        let add = `[${url}](${url})`;
        if (url.match(/\.jpg$|\.png$|\.gif$|\.bmp$/ig)) {
          add = "!" + add;
        }
        data.content = `${state.content}\n\n${add}\n\n`;
        data.view = markdown(data.content);
      } else {
        data.alertMsg = (action.ret.message || "Unknown Error") + `[${Date.now()}]`;
      }
      return Object.assign({}, state, data);
    default:
      return state;
  }
}
