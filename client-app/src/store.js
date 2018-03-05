import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { promiseMiddleware } from "./middleware";

import auth from "./reducers/auth";
import common from "./reducers/common";
import home from "./reducers/home";

const reducer = combineReducers({
  auth,
  common,
  home
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxStore = createStore(reducer, composeEnhancers(applyMiddleware(promiseMiddleware)));

export default reduxStore;
