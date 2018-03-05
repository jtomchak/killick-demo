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
        console.log(error);
        action.payload = error.message;
        store.dispatch(action);
      });
    return;
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === "function";
}

export { promiseMiddleware };
