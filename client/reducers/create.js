import { UPDATE_PATH } from "redux-simple-router";

import {
  ATTRIBUTE,
  SUBMITTING,
  SUBMITTED } from "../actions/create.js";

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
  switch (action.type) {
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
