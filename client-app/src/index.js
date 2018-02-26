import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const defaultState = {
  appName: "Killick",
  articles: null
};

const reducer = function(state = defaultState, action) {
  return state;
};

const reduxStore = createStore(reducer);

ReactDOM.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
