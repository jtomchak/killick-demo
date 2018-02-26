import React, { Component } from "react";
import { connect } from "react-redux";

import Home from "./Home";

const mapStateToProps = state => ({
  appName: state.appName
});

class App extends Component {
  render() {
    return <Home />;
  }
}

export default connect(mapStateToProps)(App);
