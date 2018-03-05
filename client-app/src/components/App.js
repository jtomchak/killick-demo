import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { push } from "react-router-redux";
import { connect } from "react-redux";

import { reduxStore } from "../store";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";

const mapStateToProps = state => ({
  appName: state.common.appName,
  redirectTo: state.common.redirectTo
});

const mapDispatchToProps = dispatch => ({
  onRedirect: () => dispatch({ type: "REDIRECT" })
});

class App extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      reduxStore.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }
  render() {
    return (
      <div>
        <Header appName={this.props.appName} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/" component={Login} />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
