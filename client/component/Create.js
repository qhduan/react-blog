"use strict";

import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";
import { pushPath } from "redux-simple-router";

import { createAttribute, createSubmit } from "../actions/create.js";
import Loading from "../component/Loading.js";
import Alert from "../component/Alert.js";
import "../css/Create.scss";

class Create extends Component {

  constructor (props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;
    if (nextProps.alertMsg != this.props.alertMsg && nextProps.alertMsg.length) {
      this.refs.alert.show({
        message: nextProps.alertMsg,
        onclose: () => {
          if (nextProps.alertMsg.match(/created/)) {
            dispatch(pushPath("/"));
          }
        }
      });
    }
  }

  render () {
    const { isFetching, title, type, date, category, content, view, password, dispatch } = this.props;
    return (
      <div className="create container">
        <Alert ref="alert" />
        <Loading isFetching={ isFetching } />
        <Link to="/">Home</Link>
        <header>
          <h1>Create New Article</h1>
        </header>
        <section>
          <label htmlFor="title">Title:</label>
          <input onChange={ event => { dispatch(createAttribute("title", event.target.value)); } } id="title" type="text" />
        </section>
        <section>
          <label htmlFor="type">Type:</label>
          <select onChange={ event => { dispatch(createAttribute("type", event.target.value)); } } id="type" >
            <option value="post">post</option>
            <option value="article">article</option>
          </select>
        </section>
        <section>
          <label htmlFor="date">Date:</label>
          <input readOnly value={ date } id="date" type="text" />
        </section>
        <section>
          <label htmlFor="category">Category:</label>
          <input onChange={ event => { dispatch(createAttribute("category", event.target.value)); } } id="category" type="text" />
        </section>
        <section>
          <label htmlFor="content">Content:</label>
          <textarea onChange={ event => { dispatch(createAttribute("content", event.target.value)); } } id="content" ></textarea>
        </section>
        <section>
          <label htmlFor="view">View:</label>
          <div dangerouslySetInnerHTML={ { __html: view } } id="view" ></div>
        </section>
        <section>
          <label htmlFor="password">Password:</label>
          <input onChange={ event => { dispatch(createAttribute("password", event.target.value)); } } id="password" type="password" />
        </section>
        <section>
          <button onClick={ event => { dispatch(createSubmit({title, type, date, category, content, password})); } } >
            Submit
          </button>
        </section>
      </div>
    );
  }
};

Create.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  alertMsg:   PropTypes.string.isRequired,
  title:      PropTypes.string.isRequired,
  type:       PropTypes.string.isRequired,
  date:       PropTypes.string.isRequired,
  category:   PropTypes.string.isRequired,
  content:    PropTypes.string.isRequired,
  view:       PropTypes.string.isRequired,
  password:   PropTypes.string.isRequired,
  dispatch:   PropTypes.func.isRequired
};

function mapStateToProps (state) {
  const { create } = state;
  const {
    isFetching,
    alertMsg,
    title,
    type,
    date,
    category,
    content,
    view,
    password
  } = create;

  return {
    isFetching,
    alertMsg,
    title,
    type,
    date,
    category,
    content,
    view,
    password
  }
}

export default connect(mapStateToProps)(Create);
