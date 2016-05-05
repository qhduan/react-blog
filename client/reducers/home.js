"use strict";

import {
  REQUEST,
  RECEIVE } from "../actions/home.js";

const initialState = {
  data: null,
  isFetching: false,
  title: "",
  category: "",
  categories: [],
  articles: [],
  posts: [],
  page: 1,
  maxPage: 1
};

function homeReceive (state, action) {
  const {title, posts, articles, page, category, categories, maxPage} = action;
  return Object.assign({}, state, {
    data: action.data,
    isFetching: false,
    title,
    category,
    categories,
    articles,
    posts,
    page,
    maxPage
  });
}

export default function home (state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE:
      return homeReceive(state, action);
    default:
      return state;
  }
}
