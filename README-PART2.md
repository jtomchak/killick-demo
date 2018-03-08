[README.md](README.md)

<!-- TOC -->

* [Part-20](#part-20)
  * [Save JWT to local-storage](#save-jwt-to-local-storage)
* [Part-21](#part-21)
  * [Hydrate localstorage JWT](#hydrate-localstorage-jwt)
* [Part-22](#part-22)
  * [Endpoint `/api/user` doesn't seem to be working ?](#endpoint-apiuser-doesnt-seem-to-be-working-)
    * [What if we manually remove the JWT from local storage and refresh the page. OPPS! How would we fix that ?](#what-if-we-manually-remove-the-jwt-from-local-storage-and-refresh-the-page-opps-how-would-we-fix-that-)
* [Part-23](#part-23)
  * [Register New Users](#register-new-users)
* [Part-24](#part-24)
  * [User Settings, how do they log out?](#user-settings-how-do-they-log-out)
* [Part-25](#part-25)
  * [Redux Logger, another look at what's happening](#redux-logger-another-look-at-whats-happening)
* [Part-26](#part-26)
  * [User Settings form, users can edit their stuff.](#user-settings-form-users-can-edit-their-stuff)
* [Part-27](#part-27)
  * [what does services.Auth.save do?](#what-does-servicesauthsave-do)
* [Part-28](#part-28)
  * [Client Reducer for 'SETTINGS_SAVED'](#client-reducer-for-settings_saved)
* [Part-29](#part-29)
  * [Finally Articles!](#finally-articles)
  * [Article Services](#article-services)
* [Part-30](#part-30)
  * [Backend Endpoint for Articles by slug](#backend-endpoint-for-articles-by-slug)
* [Part-31](#part-31)
  * [Comments, are there any ?](#comments-are-there-any-)
* [Part-32](#part-32)
* [Part-33](#part-33)
  * [Posting Comments](#posting-comments)
* [Part-34](#part-34)
  * [Comments Input Component, Service, and Reducer](#comments-input-component-service-and-reducer)
* [Part-35](#part-35)
  * [Post New Article Endpoint](#post-new-article-endpoint)
* [Part-36](#part-36)
  * [New Editor Component](#new-editor-component)

<!-- /TOC -->

# Part-20

## Save JWT to local-storage

* and we can do it with???? **Middleware**
* if the action type is "LOGIN" or "REGISTAR" we want to leverage the standard browser method `setItem` on `window.localStorage` like so:
  `window.localStorage.setItem("jwt", action.payload.user.token);`
* we also want to save that token to an axios instance for all subsequent requests.

```js
//src/services.js
const setToken = (token = null) =>
  (axiosInstance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "");
```

# Part-21

## Hydrate localstorage JWT

* now that we are setting the JWT to localstorage, we want to retrieve it when the App component is mounted using a life cycle method.

```js
//src/App.js

componentWillMount() {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      //set token with axios
      services.setToken(token);
    }
    //if there is a token, we want to make an HTTP call for current user
    //do we have that set up on the server side yet? idk
    this.props.onLoad(token ? services.Auth.currentUser() : null, token);
  }
```

* What we're saying is that if we're about to get a token from window localStorage we want to call `services.setToken` and pass it that token, so axios has it on all further requests.
* `this.props.onLoad` is going to call `services.Auth.currentUser` if there is a token, this will fetch the current user profile with nothing more than the JWT, and load that sucker into the store. Just as if the user had signed in! Sweet.

# Part-22

## Endpoint `/api/user` doesn't seem to be working ?

* Let's create an endpoint for it

```js
//routes/api/users.js
//User return user info,
//Protected Route, notice the call to auth.required before the function!!
router.get("/user", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});
```

* auth.required should decode the JWT sent in the header of the request, and append the json payload that has user.id, user.username, and exp to the req object.
* then we can get the user.id with `req.payload.id` and do a fineOne on the Users Model to get a valid user profile, and send it back!
* it appears to be working, but it's updating the header with currentUser ?? mmmmm. Are we setting current user on APP_LOAD, or just LOGIN? That might be it.
  `currentUser: action.error ? null : action.payload.user,`

### What if we manually remove the JWT from local storage and refresh the page. OPPS! How would we fix that ?

# Part-23

## Register New Users

* Let's make a Register Component, it's pretty much _mostly_ like login, but with username field too. Easy Peasy, right?
* thank goodness we have the API ENDPOINT ALREADY!
* services post auth register, hopfully you're starting to see the benefits of the services setup now that we are started to add a couple calls. maybe?

```js
//services.js
register: (username, email, password) =>
  requests.post("/users", { user: { username, email, password } });
```

* auth reducer to handle 'REGISTER' a lot like login
  * infact, it's exactly like 'LOGIN', gosh, I wonder if there's a way we can leverage that, and not have to write things out twice?!?!
* Sweet. Now make a user, **SO AMAZING**

# Part-24

## User Settings, how do they log out?

* Creating a component `Settings.js`
* Add a corresponding route in `App.js` client side, right?
* We'll need to add a switch case to our `common.js` reducer to handle 'LOGOUT'

```js
case 'LOGOUT':
      return { ...state, redirectTo: '/', token: null, currentUser: null };
```

* We also need to remove the JWT from localstorage, we can do this using our custom localStorageMiddleware!

```js
//src/middleware.js
else if (action.type === 'LOGOUT') {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }
```

* Rad, now we can log out. **AND** when the currentUser is reset to null, the Header is already set to change!!!!! How cool is that!!!!!

# Part-25

## Redux Logger, another look at what's happening

* `cd client-app && npm install redux-logger`
* we can set a conditional as to whether we are in dev or production environment

```js
//store.js
const getMiddleware = () => {
  if (process.env.NODE_ENV === "production") {
    return compose(applyMiddleware(myRouterMiddleware, promiseMiddleware, localStorageMiddleware));
  } else {
    // Enable additional logging in non-production environments.
    return composeEnhancers(
      applyMiddleware(myRouterMiddleware, promiseMiddleware, localStorageMiddleware, createLogger())
    );
  }
};
```

# Part-26

## User Settings form, users can edit their stuff.

* Refactoring Settings into a feature component with `index.js and SettingsForm.js`

```
├── Home
├── Settings
│   └── SettingsForm.js
│   └── index.js
├── App.js
```

```js
//src/Settings/index.js

<SettingsForm currentUser={this.props.currentUser} onSubmitForm={this.props.onSubmitForm} />
```

* Then in settings form we are gonna need a pile of lifecycle methods

  1.  `updateState` with changes to form fields
  2.  `submitForm` that is clean the state object, and call `this.props.onSubmitForm`
  3.  `componentDidMount` to take the currentUser via props and merge it with state

* At this point if we refresh the profile page, we don't get any information in it. **d'oh** So how would we fix this? What lifecycle method would we use?

# Part-27

### what does services.Auth.save do?

* it's a HTTP PUT method that will update our user model on the server

> The HTTP PUT request method creates a new resource or replaces a representation of the target resource with the request payload.

> The difference between PUT and POST is that PUT is idempotent: calling it once or several times successively has the same effect (that is no side effect), where successive identical POST may have additional effects, like passing an order several times.

* So let's make that service, **AND** handle it on the backend!

```js
//services.js
[...]
 save: user => requests.put("/user", { user })
```

* And what would the route handling look like?
* It's going to be protected, so it's got auth.required on it
* We only want to set the properties that were `PUT` up to the server

```js
//routes/api/users.js
// only update fields that were actually passed...
if (typeof req.body.user.username !== "undefined") {
  user.username = req.body.user.username;
}
```

* So now our call to `/api/user` as an HTTP PUT should be working, but the page just sits there? mmmmm, why do you think that is? let's tackle that in the next section

# Part-28

### Client Reducer for 'SETTINGS_SAVED'

* We're gonna want to handle the action 'SETTINGS_SAVED' in two places.
  1.  a new `settings.js` reducer
  2.  and `common.js` bc it's getting updated currentUser info.

```js
//reducers/common.js
 case "SETTINGS_SAVED":
      return {
        ...state,
        redirectTo: action.error ? null : "/",
        currentUser: action.error ? null : action.payload.user
      }
```

* redirectTo and currentUser should not be surprising to you at this point, right?

# Part-29

### Finally Articles!

* `npm install marked`
* We'll start with the 'read more' on the article preview
* What we have is a link to `/articles/${article.slug}`
* Let's handle this route, it's gonna be dynamicly, remember the ':'

```js
//src/components/App.js
<Route path="/article/:id" component={Article} />
```

* Thanks gonna error out, so we'll need the Article Component too. lol
  * So we create a Folder `Article` with `index.js`
  * Set up this componen to fetch the article by slugId, we're also gonna need it to get all the comments for this Article, **OH BOY**
  * That's where Promise.all comes into [play](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
  * And what are we doing with the marked library ? well, i like markup, so we want to be able to write in markup, and have it rendered to HTML.
  * Use of [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml).

### Article Services

* we want to add get with slug for articles

```js
//services.js
//articles...
get: slug => requests.get(`/articles/${slug}`)`

const Comments = {
  forArticle: slug => requests.get(`/articles/${slug}/comments`)
};`
```

* We also need a reducer for Articles, **ADD** it to the store too!!!!!!

```js
//reducers/articles.js

export default (state = {}, action) => {
  switch (action.type) {
    case "ARTICLE_PAGE_LOADED":
```

* So at this point our page should render _blank_ and we're making 2 network request that fail, because we haven't created those endpoints yet. next step!!!!!

# Part-30

### Backend Endpoint for Articles by slug

* `npm install slug` for the server
* We are gonna need to beef up our User Model, and our Articles Model

```js
//models/Articles
const ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    favoritesCount: { type: Number, default: 0 },
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

//models/Users
//just a new method for our User's Model
UserSchema.methods.toProfileJSONFor = function() {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image || "https://static.productionready.io/images/smiley-cyrus.jpg"
  };
};
```

* we're gonna need to handle `/api/articles/:articleId` **AND** `/api/articles/:articleId/comments`

* this can be tough, is there a better way to debug? sure
  * VSCODE Debug, attache to process and we can set breakpoints. that's rad!

```js
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach by Process ID",
      "processId": "${command:PickProcess}"
    }
  ]
}
```

* Now we can test the crap out of this endpoint using postman.

![alt postman](https://i.imgur.com/l5fVDJr.png)

* That's way more helpful!!!!!
* Now we aren't making a second Promise Query......yet, but it's good to talk about it now!

```js
//routes/api/articles.js
// return a article by slug-id, we also want to get user who is actually signed in.
router.get("/:article", auth.optional, function(req, res, next) {
  Promise.all([req.article.populate("author").execPopulate()])
    .then(function(results) {
      return res.json({ article: req.article.toJSONFor() });
    })
    .catch(next);
});
```

* alright, **WOW** so articles by slug is working, we've beefed up or Article Model, we can now **FINALLY** click on an article and see the content. oh man, what a great job!!!

# Part-31

## Comments, are there any ?

* We'll need that endpoint for the service we set up in step 30. `/articles/${slug}/comments`
* We need a Comments Schema before anything else

```js
//models/Comments
const CommentSchema = new mongoose.Schema(
  {
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" }
  },
  { timestamps: true }
);
```

* We'll to this in our `/routes/api/articles.js` to handle the GET request

```js
//routes/api/articles.js
router.get("/:article/comments", auth.optional, function(req, res, next) {
```

* What in the world is going on here [Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
  `Promise.resolve(req.payload ? User.findById(req.payload.id) : null)`

  * if there is a payload on the request object, remember this happens is the HTTP request has a valid bear token on it, then we're going to go ahead with User Model Query by Id, otherwise we resolve null, and continue with a call `.then()`

* Now with the Comments coming back let's create a CommentContainer, CommentList, and Comment

# Part-32

* With the Comments coming back, we need to create a CommentContainer and pass it the comments, any errors, the slug, and the currentUser. We should have all this from wiring up the store to article/index.js

```js
//components/article/index.js
<CommentContainer
  comments={this.props.comments || []}
  errors={this.props.commentErrors}
  slug={this.props.match.params.id}
  currentUser={this.props.currentUser}
/>
```

* The Comment Container will render a signin/signup link if isn't a current user, later we'll add comment input box if their is a current user.
* For the CommentList is just a component that will map over our list of comments and render each comment element as a Comment React Component.

```js
//components/article/CommentList.js
{
  props.comments.map(comment => {
    return (
      <Comment
        comment={comment}
        currentUser={props.currentUser}
        slug={props.slug}
        key={comment.id}
      />
    );
  });
}
```

* Then each Comment component render makes these really cool block
  ![Imgur](https://i.imgur.com/djLlTvx.png)

# Part-33

### Posting Comments

* We need a http POST method to add comments to an article `/api/article/:article/comments`
* Auth is definetly required for this endpoint, **NOT OPTIONAL**
  * if there is no user we send back a 401
* `router.post("/:article/comments", auth.required, function(req, res, next) {`
* With the endpoint filled out, we should be able to hit it with Postman using the following payload. We don't need the article or user info, that is pulled from the url slug and JWT decode respectively!!!

```json
{
  "comment": {
    "body": "This is freakin' awesome!!!!"
  }
}
```

![Postman](https://i.imgur.com/CqiYfna.png)

# Part-34

## Comments Input Component, Service, and Reducer

* We have an endpoint, lets make that input!!!!!
* We need a service to do the posting of the comment for us
  `create: (slug, body) => requests.post(`articles/${slug}/comments`, { comment: body })`
* Cool, now we can make a component in our Articles feature `CommentInput.js` that will dispatch our comment POST promise

```js
//src/components/Article/CommentsInput.js
const mapDispatchToProps = dispatch => ({
  onSubmit: payload => dispatch({ type: "Add_COMMENT", payload })
});
```

* Handling the `ADD_COMMENT` in our article reducer would be the next step
  * for comments we want to set it to state.commnets **OR** empty array if there isn't any, **AND** append or `concat` our new comment via the action.payload to the exisitng comments.

```js
//src/reducers/article.js
case "ADD_ARTICLE":
      return {
        ...state,
        commentErrors: action.error ? action.payload.errors : null,
        comments: action.error ? null : (state.comments || []).concat([action.payload.comment])
      };
```

* sweet it's posting, but sadly it's not updating until we refresh the page, or jump back home and reload that component, how would we fix this?? _can you find the error_?

# Part-35

### Post New Article Endpoint

* Finally posting a new article. http POST method to `/api/articles`
* Our article route will start something like this:

```js
router.post("/", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
```

* Here's a sample payload to use via postman

```json
{
  "article": {
    "title": "New Town",
    "description": "Finally a new article",
    "body": "# Finally\n\n* you've done it\n* you've made it, sweet\n* but only via postman",
    "tagList": ["made it", "finally"]
  }
}
```

# Part-36

### New Editor Component

* Editor Component, Route, Article POST
*
