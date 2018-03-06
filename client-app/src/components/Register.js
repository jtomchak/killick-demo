import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import services from "../services";
import ListErrors from "./ListErrors";

//any of the properties on store auth will be spread out to props of the
//login component
const mapStateToProps = state => ({ ...state.auth });

//Here we dispatch an action object with a property 'payload' that's value
//is a promise returned from calling services.Auth.register, remmber this will be
//picked up by our middleware reducer and the resolve/reject will be handled there and passed
//on to the redux store
const mapDispatchToProps = dispatch => ({
  onSubmit: (username, email, password) => {
    dispatch({ type: "REGISTER", payload: services.Auth.register(username, email, password) });
  }
});

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: ""
  };
  handleInputChange = event => {
    const targetName = event.target.name;

    this.setState({
      [targetName]: event.target.value
    });
  };

  submitForm = event => {
    event.preventDefault();
    const { username, email, password } = this.state;
    this.props.onSubmit(username, email, password);
  };

  render() {
    const { username, email, password } = this.state;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="login">Have an account?</Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={e => this.submitForm(e)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={username}
                      onChange={this.handleInputChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.handleInputChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.handleInputChange}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}
                  >
                    Join Killick
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
