"use strict";

import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import { Link } from "react-router";

import "isomorphic-fetch";
import "../scss/Article.scss";

export default class Article extends Component {

  constructor (props) {
    super(props);
    this.state = {
      content: null
    };
  }

  render () {
    const { id, title, content } = this.props;
    if (content) {
      return (
        <div className="article">
          <h4>
            <Link to={ "/view/" + id }>{ title }</Link>
          </h4>
          <article dangerouslySetInnerHTML={ { __html: content } }></article>
        </div>
      );
    } else {
      return (
        <div className="article">
          <h4>
            <Link to={ "/view/" + id }>{ title }</Link>
          </h4>
          <article>
            Loading...
          </article>
        </div>
      );
    }
  }

}
