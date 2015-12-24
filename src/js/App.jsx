"use strict";

import React      from "react";
import ReactDOM   from "react-dom";
import { Router, Route, IndexRoute } from "react-router";

import IndexPage  from "../component/IndexPage.jsx";
import ViewPage   from "../component/ViewPage.jsx";
import CreatePage from "../component/CreatePage.jsx";
import UpdatePage from "../component/UpdatePage.jsx";


class App extends React.Component {
  render () {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <Router>
      <Route path="/" component={ App }>
        <IndexRoute component={ IndexPage } />
        <Route path="category/:category/page/:page" component={ IndexPage } />
        <Route path="page/:page" component={ IndexPage } />
        <Route path="view/:id" component={ ViewPage } />
        <Route path="update/:id" component={ UpdatePage } />
        <Route path="create" component={ CreatePage } />
      </Route>
    </Router>
  </div>, document.getElementById("view"));
