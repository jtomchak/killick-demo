import services from "./services";

const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: "ASYNC_START", subtype: action.type });
    action.payload
      .then(res => {
        action.payload = res;
        store.dispatch(action);
      })
      .catch(error => {
        action.error = true;
        action.payload = error.response.data.errors;
        store.dispatch(action);
      });
    return;
  }

  next(action);
};

const localStorageMiddleware = store => next => action => {
  if (action.type === "LOGIN" || action.type === "REGISTER") {
    if (!action.error) {
      window.localStorage.setItem("jwt", action.payload.user.token);
      //set axios header auth instance
      services.setToken(action.payload.user.token);
    }
  } else if (action.type === "LOGOUT") {
    window.localStorage.setItem("jwt", "");
    services.setToken(); //calling setToken without an argument will have it use the default `null` we set up.
  }
  next(action);
};

function isPromise(v) {
  return v && typeof v.then === "function";
}

export { localStorageMiddleware, promiseMiddleware };
