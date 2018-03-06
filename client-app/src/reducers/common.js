const defaultState = {
  appName: "Killick",
  token: null,
  articles: null
};

//seting up our APP_LOAD AND REDIRECT reducers
export default (state = defaultState, action) => {
  switch (action.type) {
    case "APP_LOAD":
      return {
        ...state,
        token: action.token || null,
        currentUser: action.error || !action.payload ? null : action.payload.user,
        appLoaded: true
      };
    case "REDIRECT":
      return { ...state, redirectTo: null };
    case "LOGOUT":
      return { ...state, redirectTo: "/", token: null, currentUser: null };
    case "LOGIN":
    case "REGISTER": {
      return {
        ...state,
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
        redirectTo: action.error ? null : "/"
      };
      //need to handle some error.
    }
    default:
      return state;
  }
};
