import React, { Component, PropTypes } from "react";

import "../css/Prompt.scss";

export default class Prompt extends Component {
  constructor (props) {
    super(props);
    this.state = {
      message: null,
      onclose: null,
      isPassword: false,
      input: ""
    };
  }

  show ({message, onclose, isPassword}) {
    this.setState({
      message, onclose, isPassword
    });
  }

  ok (event) {
    event.preventDefault();
    const { onclose, input } = this.state;
    this.setState({ message: null });
    onclose(input);
  }

  cancel (event) {
    event.preventDefault();
    const { onclose } = this.state;
    this.setState({ message: null });
    onclose(null);
  }

  render () {
    const { message, onclose, isPassword, input } = this.state;
    if (message) {
      return (<div className="prompt">
          <div className="box">
            <div className="prompt-header">{ message }</div>
            <div>
              <input
                type={ isPassword ? "password" : "text" }
                onChange={ event => { this.setState({input: event.target.value}); } } />
            </div>
            <div className="prompt-footer">
              <a href="" onClick={ event => { this.ok(event) } } >OK</a>
              <a href="" onClick={ event => { this.cancel(event) } } >Cancel</a>
            </div>
          </div>
        </div>);
    } else {
      return (<div></div>)
    }
  }
};
