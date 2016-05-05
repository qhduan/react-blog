"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer, routerMiddleware } from "react-router-redux";

import reducers from "./reducers";

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));

const createStoreWithMiddleware = applyMiddleware(
    thunk,
    routerMiddleware(browserHistory) // 加入了这个之后才可以用dispatch(push("url"))
)(createStore);
const store = createStoreWithMiddleware(reducer);
const history = syncHistoryWithStore(browserHistory, store);

import Home   from "./component/Home.js";
import View   from "./component/View.js";
import Create from "./component/Create.js";
import Update from "./component/Update.js";
import "./scss/Global.scss";

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/">
        <IndexRoute component={ Home } />
        <Route path="/category/:category/page/:page/" component={ Home } />
        <Route path="/category/:category/page/:page" component={ Home } />
        <Route path="/category/:category/" component={ Home } />
        <Route path="/category/:category" component={ Home } />
        <Route path="/page/:page/" component={ Home } />
        <Route path="/page/:page" component={ Home } />
        <Route path="/view/:id/" component={ View } />
        <Route path="/view/:id" component={ View } />
        <Route path="/update/:id/" component={ Update } />
        <Route path="/update/:id" component={ Update } />
        <Route path="/create/" component={ Create } />
        <Route path="/create" component={ Create } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
