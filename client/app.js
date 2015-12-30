"use strict";

import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute } from "react-router";
import { createHistory } from "history";
import { syncReduxAndRouter, routeReducer } from "redux-simple-router";
import reducers from "./reducers";

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

const store = createStoreWithMiddleware(reducer);
const history = createHistory();

syncReduxAndRouter(history, store);

import App    from "./containers/App.js";
import Home   from "./component/Home.js";
import View   from "./component/View.js";
import Create from "./component/Create.js";
import Update from "./component/Update.js";
import "./css/Global.scss";

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ App }>
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
