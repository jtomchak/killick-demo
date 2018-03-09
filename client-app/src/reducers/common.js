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
    }
    case "SETTINGS_SAVED":
      return {
        ...state,
        redirectTo: action.error ? null : "/",
        currentUser: action.error ? null : action.payload.user
      };
    case "ARTICLE_SUBMITTED":
      const redirectUrl = `article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    case "DELETE_ARTICLE":
      return { ...state, redirectTo: "/" };
    default:
      return state;
  }
};
