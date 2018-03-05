import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { promiseMiddleware } from "./middleware";

import createHistory from "history/createBrowserHistory";

import auth from "./reducers/auth";
import common from "./reducers/common";
import home from "./reducers/home";
//init browser history API
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

const reducer = combineReducers({
  auth,
  common,
  home,
  router: routerReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reduxStore = createStore(
  reducer,
  composeEnhancers(applyMiddleware(myRouterMiddleware, promiseMiddleware))
);
