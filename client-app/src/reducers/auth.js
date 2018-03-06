export default (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER": {
      return {
        ...state,
        inProgess: false,
        errors: action.error ? action.payload : null
      };
    }
    case "ASYNC_START":
      if (action.subtype === "LOGIN" || action.subtype === "REGISTER") {
        return { ...state, inProgress: true };
      } else {
        return state;
      }
    default:
      return state;
  }
};
