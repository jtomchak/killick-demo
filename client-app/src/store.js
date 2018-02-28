import { createStore, applyMiddleware, compose } from "redux";
import { promiseMiddleware } from "./middleware";

const defaultState = {
  appName: "Killick",
  articles: null
};

const reducer = function(state = defaultState, action) {
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

export default reduxStore;
