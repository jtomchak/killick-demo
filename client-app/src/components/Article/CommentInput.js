import React, { Component } from "react";
import services from "../../services";
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => ({
  onSubmit: payload => dispatch({ type: "Add_COMMENT", payload })
});

class CommentInput extends Component {
  state = {
    body: ""
  };

  setBody = ev => {
    this.setState({ body: ev.target.value });
  };

  createComment = ev => {
    ev.preventDefault();
    const payload = services.Comments.create(this.props.slug, { body: this.state.body });
    this.setState({ body: "" }); //reset body to blank after capturing it
    this.props.onSubmit(payload);
  };

  render() {
    return (
      <form className="card comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea
            className="form-control"
            placeholder="Write a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows="3"
          />
        </div>
        <div className="card-footer">
          <img
            src={this.props.currentUser.image}
            className="comment-author-img"
            alt={this.props.currentUser.username}
          />
          <button className="btn btn-sm btn-primary" type="submit">
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(CommentInput);
