import React, { Component } from "react";
import { connect } from "react-redux";

import services from "../services";
import ListErrors from "./ListErrors";

const mapStateToProps = state => {
  return {
    ...state.settings,
    currentUser: state.common.currentUser
  };
};

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: "LOGOUT" }),
  onSubmitForm: user => dispatch({ type: "SETTINGS_SAVED", payload: services.Auth.save(user) })
});

class Settings extends Component {
  render() {
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <ListErrors errors={this.props.errors} />

              <hr />

              <button className="btn btn-outline-danger" onClick={this.props.onClickLogout}>
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
