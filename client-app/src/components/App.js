import React, { Component } from "react";
import { connect } from "react-redux";

import Home from "./Home";

class App extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  render() {
    return <Home />;
  }
}

export default connect(mapStateToProps)(App);
