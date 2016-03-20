"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";

/*
 * 初始化redux调试工具
 * https://github.com/gaearon/redux-devtools
 */
import { createDevTools } from "redux-devtools";
import LogMonitor from "redux-devtools-log-monitor";
import DockMonitor from "redux-devtools-dock-monitor";
const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h' changePositionKey='ctrl-q'>
    <LogMonitor theme='tomorrow' />
  </DockMonitor>
);

const enhancer = compose(
    DevTools.instrument()
);

import reducers from "./reducers";

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));

const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore);
const store = createStoreWithMiddleware(reducer, enhancer);

const history = syncHistoryWithStore(browserHistory, store)

class App extends Component {
  render () {
    return (
      <div>
        { this.props.children }
        <DevTools />
      </div>
    );
  }
}

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
