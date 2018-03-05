import React from "react";
import { connect } from "react-redux";
import services from "../services";

import ListErrors from "./ListErrors";

const mapStateToProps = state => ({ ...state.auth });
const mapDispatchToProps = dispatch => ({
  onSubmit: (email, password) =>
    dispatch({ type: "LOGIN", payload: services.Auth.login(email, password) })
});

class Login extends React.Component {
  state = {
    email: null,
    password: null
  };

  handleInputOnChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleOnSubmit = event => {
    event.preventDefault();
    //dispatch the login service promise as an action to redux
    this.props.onSubmit(this.state.email, this.state.password);
  };

  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <a>Need an account?</a>
              </p>
              <ListErrors errors={this.props.errors} />
              <form onSubmit={this.handleOnSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={this.handleInputOnChange}
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      name="email"
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      onChange={this.handleInputOnChange}
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      name="password"
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}
                  >
                    Sign in
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
