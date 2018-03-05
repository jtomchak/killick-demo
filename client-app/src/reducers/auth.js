export default (state = {}, action) => {
  console.log(action.type, action.payload);
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        ...action.payload.user,
        inProgess: false
      };
      //need to handle some error.
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
