const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    action.payload
      .then(res => {
        console.log(res);
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
