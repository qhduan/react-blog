import { UPDATE_PATH } from "react-router-redux";

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

function updatePath (state, action) {
  if ( !state.data ) {
    return state;
  }

  let data = state.data;
  const { page, category } = parsePageAndCategory();
  let posts = data.articles.filter(element => {
    return element[3] == "post";
  });
  if (category.length) {
    posts = posts.filter(element => {
      return element[4] == category;
    });
  }
  let maxPage = Math.ceil(posts.length / data.pageCount);
  posts = posts.splice(
    (page - 1) * data.pageCount,
    data.pageCount);
  return Object.assign({}, state, {
    category: category,
    posts: posts,
    page: page,
    maxPage: maxPage
  });
}

function homeReceive (state, action) {
  let {data, page, category} = action;
  data.articles.sort((a, b) => {
    if (a[2] > b[2]) return -1;
    else if (a[2] < b[2]) return 1;
    return 0;
  });
  let articles = data.articles.filter(element => {
    return element[3] == "article";
  });
  let posts = data.articles.filter(element => {
    return element[3] == "post";
  });
  let categories = [[], ...posts].reduce((arr, element) => {
    if (element[4].length && arr.indexOf(element[4]) == -1) {
      arr.push(element[4]);
    }
    return arr;
  });
  if (category.length) {
    posts = posts.filter(element => {
      return element[4] == category;
    });
  }
  let maxPage = Math.ceil(posts.length / data.pageCount);
  posts = posts.splice(
    (page - 1) * data.pageCount,
    data.pageCount);
  return Object.assign({}, state, {
    data: action.data,
    isFetching: false,
    title: action.data.title,
    category: category,
    categories: categories,
    articles: articles,
    posts: posts,
    page: page,
    maxPage: maxPage
  });
}

export default function home (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PATH:
      return updatePath(state, action);
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
