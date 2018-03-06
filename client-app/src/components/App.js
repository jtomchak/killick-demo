import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { push } from "react-router-redux";
import { connect } from "react-redux";

import { reduxStore } from "../store";
import services from "../services";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

const mapStateToProps = state => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo
});

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) => dispatch({ type: "APP_LOAD", payload, token, skipTracking: true }),
  onRedirect: () => dispatch({ type: "REDIRECT" })
});

class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      reduxStore.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }
  componentWillMount() {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      //set token with axios
      services.setToken(token);
    }
    //if there is a token, we want to make an HTTP call for current user
    //do we have that set up on the server side yet? idk
    this.props.onLoad(token ? services.Auth.currentUser() : null, token);
  }
  render() {
    return (
      <div>
        <Header appName={this.props.appName} currentUser={this.props.currentUser} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
