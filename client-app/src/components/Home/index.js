import React, { Component } from "react";
import { connect } from "react-redux";
import MainView from "./MainView";
import Banner from "./Banner";

import services from "../../services";

const mapStateToProps = state => ({
  appName: state.common.appName,
  articles: state.home.articles
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: "HOME_PAGE_LOADED", payload })
});

class Home extends Component {
  componentDidMount() {
    this.props.onLoad(services.Articles.all());
  }
  render() {
    return (
      <div className="home-page">
        <Banner appName={this.props.appName} />
        <div className="container page">
          <div className="row">
            <MainView />
            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
