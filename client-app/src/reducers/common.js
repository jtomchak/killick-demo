const defaultState = {
  appName: "Killick",
  articles: null
};

//seting up our APP_LOAD AND REDIRECT reducers
export default (state = defaultState, action) => {
  switch (action.type) {
    case "APP_LOAD":
      return { ...state };
    case "REDIRECT":
      return { ...state, redirectTo: null };
    default:
      return state;
  }
};
