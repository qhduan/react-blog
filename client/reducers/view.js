import { UPDATE_PATH } from "redux-simple-router";

import {
  REQUEST,
  RECEIVE,
  REMOVING,
  REMOVED } from "../actions/view.js";

import markdown from "../../component/markdown.js";

const initialState = {
  data: {},
  alertMsg: "",
  isFetching: false,
  title: "Blog Title",
  type: "",
  date: "",
  category: "",
  content: ""
};

function viewReceive (state, action) {
  let data = action.data;
  return Object.assign({}, state, {
    data:       data,
    isFetching: false,
    title:      data.title,
    type:       data.type,
    date:       data.date,
    category:   data.category,
    content:    markdown(data.content)
  });
}

export default function view (state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE:
      return viewReceive(state, action);
    case REMOVING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case REMOVED:
      return Object.assign({}, state, {
        isFetching: false,
        alertMsg: (action.ret.success || action.ret.message || "Unknown Error") + `[${Date.now()}]`
      });
    default:
      return state;
  }
}
