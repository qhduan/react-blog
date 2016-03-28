import React, { Component, PropTypes } from "react";

import "../scss/Loading.scss";

export default class Loading extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { isFetching } = this.props;
    return (
      <div className={ isFetching ? "loading" : "loading loading-decay" }>
        <span>Loading...</span>
      </div>
    );
  }
};

Loading.propTypes = {
  isFetching: PropTypes.bool.isRequired
};
