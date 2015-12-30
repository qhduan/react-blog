"use strict";

import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";
import { pushPath } from "redux-simple-router";

import { fetchData, updateAttribute, updateSubmit } from "../actions/update.js";
import Loading from "../component/Loading.js";
import Alert from "../component/Alert.js";
import "../css/Update.scss";

class Update extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { dispatch, routeParams } = this.props;
    dispatch(fetchData(routeParams.id));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, routeParams } = this.props;
    if (nextProps.alertMsg != this.props.alertMsg && nextProps.alertMsg.length) {
      this.refs.alert.show({
        message: nextProps.alertMsg,
        onclose: () => {
          if (nextProps.alertMsg.match(/updated/)) {
            dispatch(pushPath("/view/" + routeParams.id));
          }
        }
      });
    }
  }

  render () {
    const { isFetching, id, title, type, date, edit, category, content, view, password, dispatch, routeParams } = this.props;
    return (
      <div className="update container">
        <Alert ref="alert" />
        <Loading isFetching={ isFetching } />
        <Link to="/">Home</Link>
        <header>
          <h1>Create New Article</h1>
        </header>
        <section>
          <label htmlFor="title">Title:</label>
          <input onChange={ event => { dispatch(updateAttribute("title", event.target.value)); } } value={ title } id="title" type="text" />
        </section>
        <section>
          <label htmlFor="type">Type:</label>
          <select onChange={ event => { dispatch(updateAttribute("type", event.target.value)); } } value={ type } id="type" >
            <option value="post">post</option>
            <option value="article">article</option>
          </select>
        </section>
        <section>
          <label htmlFor="date">Date:</label>
          <input readOnly value={ date } id="date" type="text" />
        </section>
        <section>
          <label htmlFor="edit">Edit:</label>
          <input readOnly value={ edit } id="edit" type="text" />
        </section>
        <section>
          <label htmlFor="category">Category:</label>
          <input onChange={ event => { dispatch(updateAttribute("category", event.target.value)); } } value={ category } id="category" type="text" />
        </section>
        <section>
          <label htmlFor="content">Content:</label>
          <textarea onChange={ event => { dispatch(updateAttribute("content", event.target.value)); } } value={ content } id="content" ></textarea>
        </section>
        <section>
          <label htmlFor="view">View:</label>
          <div dangerouslySetInnerHTML={ { __html: view } } id="view" ></div>
        </section>
        <section>
          <label htmlFor="password">Password:</label>
          <input onChange={ event => { dispatch(updateAttribute("password", event.target.value)); } } id="password" type="password" />
        </section>
        <section>
          <button onClick={ event => { dispatch(updateSubmit({ id: routeParams.id, title, type, date, edit, category, content, password})); } } >
            Submit
          </button>
        </section>
      </div>
    );
  }
};

Update.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  alertMsg:   PropTypes.string.isRequired,
  id:         PropTypes.string.isRequired,
  title:      PropTypes.string.isRequired,
  type:       PropTypes.string.isRequired,
  date:       PropTypes.string.isRequired,
  edit:       PropTypes.string.isRequired,
  category:   PropTypes.string.isRequired,
  content:    PropTypes.string.isRequired,
  view:       PropTypes.string.isRequired,
  password:   PropTypes.string.isRequired,
  dispatch:   PropTypes.func.isRequired
};

function mapStateToProps (state) {
  const { update } = state;
  const {
    isFetching,
    alertMsg,
    id,
    title,
    type,
    date,
    edit,
    category,
    content,
    view,
    password
  } = update;

  return {
    isFetching,
    alertMsg,
    id,
    title,
    type,
    date,
    edit,
    category,
    content,
    view,
    password
  }
}

export default connect(mapStateToProps)(Update);