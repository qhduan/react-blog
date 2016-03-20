import { UPDATE_PATH } from "react-router-redux";

import {
  ATTRIBUTE,
  SUBMITTING,
  SUBMITTED,
  UPLOADING,
  UPLOADED } from "../actions/create.js";

import markdown from "../../component/markdown.js";

const initialState = {
  isFetching: false,
  title: "",
  type: "post",
  date: new Date().toJSON().substr(0, 19).replace("T", " "),
  category: "",
  content: "",
  view: "",
  password: "",
  alertMsg: ""
};

export default function create (state = initialState, action) {
  let data = {};
  switch (action.type) {
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
