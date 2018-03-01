import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import { connect } from "react-redux";

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
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, () => ({}))(App);
