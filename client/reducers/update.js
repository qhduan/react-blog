import { UPDATE_PATH } from "redux-simple-router";

import {
  REQUEST,
  RECEIVE,
  ATTRIBUTE,
  SUBMITTING,
  SUBMITTED } from "../actions/update.js";

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
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE:
      return updateReceive(state, action);
    case ATTRIBUTE:
      let data = {};
      if (action.attribute == "content") {
        data.content = action.value;
        data.view = markdown(action.value);
      } else {
        data[action.attribute] = action.value;
      }
      return Object.assign({}, state, data);
    case SUBMITTING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case SUBMITTED:
      return Object.assign({}, state, {
        isFetching: false,
        alertMsg: (action.ret.success || action.ret.message || "Unknown Error") + `[${Date.now()}]`
      });
    default:
      return state;
  }
}
