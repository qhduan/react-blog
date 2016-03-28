import React, { Component, PropTypes } from "react";

import "../scss/Alert.scss";

export default class Alert extends Component {
  constructor (props) {
    super(props);
    this.state = {
      message: null,
      onclose: null
    };
  }

  show ({message, onclose}) {
    message = message.replace(/\[\d+\]/, "");
    this.setState({
      message, onclose
    });
  }

  callback (event) {
    event.preventDefault();
    const { onclose } = this.state;
    this.setState({ message: null });
    onclose();
  }

  render () {
    const { message, onclose } = this.state;
    if (message) {
      return (<div className="alert">
          <div className="box">
            <div className="alert-header"><span>{ message }</span></div>
            <div className="alert-footer">
              <a href="" onClick={ event => { this.callback(event); } } >OK</a>
            </div>
          </div>
        </div>);
    } else {
      return (<div></div>)
    }
  }
};
