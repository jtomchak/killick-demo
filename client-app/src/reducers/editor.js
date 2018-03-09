export default (state = {}, action) => {
  switch (action.type) {
    case "ARTICLE_SUBMITTED":
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload.errors : null
      };
    case "EDITOR_PAGE_UNLOADED":
      return {};
    case "ASYNC_START":
      if (action.subtype === "ARTICLE_SUBMITTED") {
        return { ...state, inProgress: true };
      }
      return state;
    case "EDITOR_PAGE_LOADED":
      return {
        ...state,
        articleSlug: action.payload ? action.payload.article.slug : "",
        title: action.payload ? action.payload.article.title : "",
        description: action.payload ? action.payload.article.description : "",
        body: action.payload ? action.payload.article.body : "",
        tagList: action.payload ? action.payload.article.tagList : []
      };
    default:
      return state;
  }
};
