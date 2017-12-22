
console.log("BLOG SYSTEM:", "GREEN");

import React from "react";
import ReactDOM from "react-dom";
import {
    // HashRouter as Router,
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from "react-router-dom";
import "antd/dist/antd.css";

import { Layout } from "antd";
const { Content } = Layout;

import Pages from "./pages.js";

import "./default.css";



const Entry = () => (
    <div>
        <Router>
            <Switch>
                {Pages.map(p => (
                    <Route
                        exact
                        key={p.path}
                        path={p.path}
                        component={p.component}
                    />
                ))}
            </Switch>
        </Router>
    </div>
);

ReactDOM.render(<Entry />, document.querySelector("#root"));
