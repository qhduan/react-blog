"use strict";


import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";
import { pushPath } from "react-router-redux";

import { fetchData, removeArticle } from "../actions/view.js";
import Loading from "../component/Loading.js";
import Alert from "../component/Alert.js";
import Prompt from "../component/Prompt.js";
import "../css/View.scss";

class View extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { dispatch, routeParams } = this.props;
    dispatch(fetchData(routeParams.id));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;
    if (nextProps.alertMsg != this.props.alertMsg && nextProps.alertMsg.length) {
      this.refs.alert.show({
        message: nextProps.alertMsg,
        onclose: () => {
          dispatch(pushPath("/"));
        }
      });
    }
  }

  remove (event) {
    const { dispatch, routeParams } = this.props;
    event.preventDefault();
    this.refs.prompt.show({
      message: "Password please:",
      isPassword: true,
      onclose: ret => {
        if (ret) {
          dispatch(removeArticle(routeParams.id, ret));
        }
      }
    })
  }

  render () {
    const { isFetching, title, type, date, category, content, dispatch, routeParams } = this.props;
    document.title = title;
    return (
      <div className="view container">
        <Alert ref="alert" />
        <Prompt ref="prompt" />
        <Loading isFetching={ isFetching } />
        <Link to="/">Home</Link>
        <header>
          <h1><Link to={ "/view/" + routeParams.id }>{ title }</Link></h1>
        </header>
        <article dangerouslySetInnerHTML={ { __html: content } }></article>
        <footer>
          <span>{ category ? (<Link to={ "/category/" + category } >{ category }</Link>) : "" }</span>
          <span><time>{ date }</time></span>
          <span><Link to={ "/update/" + routeParams.id }>Edit</Link></span>
          <span><a href="" onClick={ event => { this.remove(event); } } >Remove</a></span>
        </footer>
      </div>
    );
  }

};

View.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  alertMsg:   PropTypes.string.isRequired,
  title:      PropTypes.string.isRequired,
  type:       PropTypes.string.isRequired,
  date:       PropTypes.string.isRequired,
  category:   PropTypes.string.isRequired,
  content:    PropTypes.string.isRequired
};

function mapStateToProps (state) {
  const { view } = state;
  const {
    isFetching,
    alertMsg,
    title,
    type,
    date,
    category,
    content
  } = view;

  return {
    isFetching,
    alertMsg,
    title,
    type,
    date,
    category,
    content
  }
}

export default connect(mapStateToProps)(View);
