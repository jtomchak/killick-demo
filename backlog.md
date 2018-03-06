# Part 03 C

* Create our ArticleList Component
  * ~~2~~ 3 scenarios: we either have articles not existing (fetching from server) or no articles at all.
* Fetch some articles. from `https://codercamps-conduit.herokuapp.com/api`
  * using superAgent to create Articles
  * we'll be able to append a bunch of other http requests to our agent as we move along.

# Part 04

* we are gonna dispatch an action on 'componentWillMount' for our component `onLoad: payload => dispatch({ type: "HOME_PAGE_LOADED", payload })`
* Created a middleware.js to handle the Promise with promiseMiddleware. This will be a collection of functions that will run when we dispatch actions, modify it in some way if it meets some conditional, then pass it on to the store via dispatch.
* Redux has a method `applyMiddleware` which will take functions, and apply them to actions.
* Now we can just pass the promise in a dispatch, and it will be resolved, before headed off to the store for reducing. Sweet!!!
* now we should have our articles conosole logged out if we put `console.log(action.paylaod)` in our reducer in the root index.js

# Part 05

* Now that we've got our first dipatch to reducers working. Let's set up the switch statement to catch on the action type "HOME_PAGE_LOADED"
* Create and Build Out the ArticlePreview component
* Add the ArticlePreview component in the ArticleList component

# Part 06

* Refactor to make room for routing. Remove all store stuff from index.js and place into a new file called store.js.
* Let's add some basic routing for our App and it's nested component. We can't hard code home into anymore(App.js Line 19), because it's not always going to be home, it might be something else, like profile or new article.

# Part 07

* Create the Login component
* Create a link to the login page in the Header component

# Part 08

* create the reducers directory and refactor out the global feed reducer
* common reducer
* auth.js reducer file
* added combineReducer
* Update the App component & Home component & MainView component
* agent for POST to api/users/login
* Login methods
* Tackle the reducer for auth, we should have auth properties username, email, token. These _should_ be available as props on the Login component with successful login. Use creds below.

```js
email: "demo_22@codercamps.com";
password: "testing001";
```

# Part 09

* Create a ListErrors Component that will take errors as prop, and render's an unordered list
* Errors _should_ be an array of objects,
* Also, if the state says there's an auth request in progress, we'll disable the submit button.
* 'ASYNC_START' what will trigger a conditional in it's respective store propterty to let us know when an async http request is in progress

# Part 10

* Some redirects on login
* added additional action to the common reducer,
* learned about componentWillReceiveProps as a lifecycle method. sweet
* wire up dispatch to 'REDIRECT' to stop the router from constantly redirecting
* Note to us, react router v4 using a component [v4](https://reacttraining.com/react-router/web/example/auth-workflow)

# Part 11

* `npm install superagent-jwt` or `yarn add superagent-jwt` we are leveraging this to fetch and append the jwt from localstorage on http request
* Localstorge as a middleware, what is local middleware
* Set up localstore to capture the jwt.
* all get and post requests now pull the jwt from localstorage and append correctly to the header
* reducer APP_LOAD to 'rehydrate' our redux store and make the currentUser request

# Part 12

* Accessing & Displaying Authentication Status Sweet.
* Update the Header component
* pass currentUser to it via props
* We'll need Postman to test the API endpoints with. Check it out [HERE](https://www.getpostman.com/)

# Part 13

* Register Users!!!
* agent post auth register
* auth reducer to handle 'REGISTER' a lot like login
* common reducer to redirect and capture the currentUser!
* Sweet. Now make a user.

# Part 14

* Settings Component with settings reducer, updated store too
* http PUT method for '/user' to save user data
* Click to logout action that will remove currentUser and redirect
* Still need to reset LocalStore, so currently, logging out then refreshing will infact log you back in. d'oh

# Part 15

* Setting Form that takes currentUser and onSubmitForm as props.
* Lifecyles for componentWillMount **AND** componentWillRecieveProps
* Merge objects in willMount before a render, that 'setState' won't work
* and that meowdium is super amazing

# Part 16

* Remove JWT from localstorage on logout.

# Part 17

* Remember Article Preview? We need to go back and swap out all the a tags for Link tags
* Added agent http methods to get a single article and the comments of it based on the slug
* Promise.all. What's that do ? Check it out [HERE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
* Article Feature Component to display whole article
* Use of [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml).

```js
/*
marked is a library that compiles markdown into HTML - in order to get react to render raw HTML, we need to use this dangerouslySetInnerHTML property, because React sanitizes HTML by default.
  */
{
  __html: marked(article.body);
}
```

# Part 18

* The great clean up. We address several of the 'warnings' that have been adding up over the course of our project. We should just be left with 2 - these we'll just live with for now. :-)
* Cleaned up console log outputs to a respectable state.

```
lowPriorityWarning.js:38 Warning: Accessing PropTypes via the main React package is deprecated, and will be removed in  React v16.0. Use the latest available v15.* prop-types package from npm instead. For info on usage, compatibility, migration and more, see https://fb.me/prop-types-docs
```

# Part 19

* Article Actions for deleting article with agent del
* Article meta data. Showing the author and created date, allowing the 'canModified' property if true, the author can delete,.
* a reducer for 'DELETE_ARTICLE' redirect to '/'

# Part 20

* Finally the Editor!!!!!!!
* but first an agent call. d'oh!

```js
create: article => requests.post("/articles", { article });
```

* Let's create an Editor component that will be our form for posting new articles.
* We've got a lot of markdown render, really just boils down to fields on change 'title, description, body, tagList, tag'
* we can dynamically add tags to our article.
* Methods `handleInputChange, handleTagChange, submitForm, removeTag`
* now we need a reducer to handle the **"ARTICLE_SUBMITTED":** in both our editor reducer and in our common reducer for redirect.

```js
case "ARTICLE_SUBMITTED":
const redirectUrl = `article/${action.payload.article.slug}`;
return { ...state, redirectTo: redirectUrl };
```

# Part 21

* Remove tag method. Removing onClick.
* Adding routing to handle `/editor/${article.slug}`
* Now our Editor Component needs to be able to populate if it's editing an article, rather than a _new_ article
* We've added componentWillRecieveProps to repopulate or remove current Editor state
* Look closely at the onSubmit method here. We need to call 'create' or 'update' based on if it's a new article or not. We know if it is from `this.props.pramas.slug`
*

```js
const promise = this.props.params.slug
  ? agent.Articles.update(Object.assign(article, slug))
  : agent.Articles.create(article);
```

* **GOAL** By the end of this you should be able to go to one of your articles, select 'edit' and have that information populated on the edit post form, the submit should also update the article

# Part 22

* Add the ability to present and add comments to other peoples posts.
* We are creating several Components in our Article folder. CommentContainer will have serveral pieces within it. A CommonentList with CommentInput for new comments. A DeleteButton to, um, delete to comment.
