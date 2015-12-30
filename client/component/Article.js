"use strict";

import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import { Link } from "react-router";

import "isomorphic-fetch";
import parseArticle from "../../component/parseArticle.js";
import markdown from "../../component/markdown.js";
import "../css/Article.scss";

export default class Article extends Component {

  constructor (props) {
    super(props);
    this.state = {
      content: null
    };
  }

  fetchArticle (id) {
    const m = id.match(/(\d{4})(\d{2})(\d{4})/);
    const year = m[1];
    const month = m[2];
    setTimeout(() => {
      fetch(`/articles/${year}/${month}/${id}.md`)
        .then(response => response.text())
        .then(data => parseArticle(data))
        .then(data => {
          this.setState({
            content: markdown(data.content)
          });
        });
    }, this.props.timeout);
  }

  componentDidMount () {
    const { id } = this.props;
    this.fetchArticle(id);
  }

  componentWillReceiveProps (nextProps) {
    const { id } = this.props;
    if (nextProps.id != id) {
      this.setState({
        content: null
      });
      this.fetchArticle(nextProps.id);
    }
  }

  render () {
    const { id, title } = this.props;
    const { content } = this.state;
    if (content) {
      return (<div className="article">
        <h4><Link to={ "/view/" + id }>{ title }</Link></h4>
        <article dangerouslySetInnerHTML={ { __html: content } }></article>
      </div>);
    } else {
      return (<div className="article">
        <h4><Link to={ "/view/" + id }>{ title }</Link></h4>
        <article>
          Loading...
        </article>
      </div>);
    }
  }

}
