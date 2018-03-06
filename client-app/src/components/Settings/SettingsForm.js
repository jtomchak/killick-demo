import React, { Component } from "react";

class SettingsForm extends Component {
  state = {
    image: "",
    username: "",
    bio: "",
    email: "",
    password: ""
  };
  //On Mount we want to assign all the currentUser props to the forms state,
  //so it's filled out
  componentDidMount() {
    if (this.props.currentUser) {
      this.setState({
        ...this.state,
        ...this.props.currentUser
      });
    }
  }

  submitForm = event => {
    event.preventDefault();

    const user = Object.assign({}, this.state);
    //we don't want to HTTP PUT a blank user
    if (!user.password) {
      delete user.password;
    }

    this.props.onSubmitForm(user);
  };

  updateState = field => event => {
    const state = this.state;
    const newState = Object.assign({}, state, { [field]: event.target.value });
    this.setState(newState);
  };

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              value={this.state.image}
              onChange={this.updateState("image")}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.updateState("username")}
            />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows="8"
              placeholder="Short bio about you"
              value={this.state.bio}
              onChange={this.updateState("bio")}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.updateState("email")}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="New Password"
              value={this.state.password}
              onChange={this.updateState("password")}
            />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={this.state.inProgress}
          >
            Update Settings
          </button>
        </fieldset>
      </form>
    );
  }
}

export default SettingsForm;
