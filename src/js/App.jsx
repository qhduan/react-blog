"use strict";

import React      from "react";
import ReactDOM   from "react-dom";

import IndexPage  from "./IndexPage.jsx";
import ViewPage   from "./ViewPage.jsx";
import CreatePage from "./CreatePage.jsx";
import UpdatePage from "./UpdatePage.jsx";


class App extends React.Component {

  constructor () {
    super();

    this.route = window.location.hash.substr(1);
  }

  componentDidMount () {
    window.addEventListener("hashchange", () => {
      this.route = window.location.hash.substr(1);
      console.log("new route: ", this.route, this.refs.child);
      if (this.refs.child.refresh) {
        this.refs.child.refresh();
      }
      this.forceUpdate();
    });
  }

  render () {

    let routes = {
      view: {
        re: /^view/,
        component: ViewPage
      },
      create: {
        re: /^create/,
        component: CreatePage
      },
      update: {
        re: /^update/,
        component: UpdatePage
      }
    };

    // default route
    let Child = IndexPage;

    // non-default routes
    for (let key in routes) {
      let r = routes[key];
      if (r.re) {
        let m = this.route.match(r.re);
        if (m) {
          Child = r.component;
        }
      }
    }

    return (
      <div>
        <Child ref="child" />
      </div>
    );
  }
};

let v = document.createElement("div");
v.id = "view";
document.body.appendChild(v);

ReactDOM.render(<App />, v);
