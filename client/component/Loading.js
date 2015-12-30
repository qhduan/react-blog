import React, { Component, PropTypes } from "react";

import "../css/Loading.scss";

export default class Loading extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { isFetching } = this.props;
    return (<div className={ isFetching ? "loading" : "loading loading-decay" }>
        <h1>Loading...</h1>
      </div>);
  }
};

Loading.propTypes = {
  isFetching: PropTypes.bool.isRequired
};
