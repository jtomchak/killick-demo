import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";

const mapStateToProps = state => ({
  appName: state.appName
});

class App extends Component {
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

export default connect(mapStateToProps, () => ({}))(App);
