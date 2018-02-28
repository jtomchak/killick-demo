import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import "./index.css";
import App from "./components/App";
import { promiseMiddleware } from "./middleware";
import registerServiceWorker from "./registerServiceWorker";

const defaultState = {
  appName: "Killick",
  articles: null
};

const reducer = function(state = defaultState, action) {
  console.log(action.type);
  switch (action.type) {
    case "HOME_PAGE_LOADED":
      return action.error
        ? state
        : {
            ...state,
            articles: action.payload.articles
          };
    default:
      return state;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxStore = createStore(reducer, composeEnhancers(applyMiddleware(promiseMiddleware)));

ReactDOM.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
