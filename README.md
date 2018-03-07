<!-- TOC -->

* [Redux codebase containing real world examples (CRUD, auth, advanced patterns, etc)](#redux-codebase-containing-real-world-examples-crud-auth-advanced-patterns-etc)
  * [Getting started](#getting-started)
  * [Setup for Front & Backend](#setup-for-front--backend)
  * [Functionality overview](#functionality-overview)
* [Part 01](#part-01)
* [Part 02](#part-02)
* [Part 03 A](#part-03-a)
* [Part 03 B](#part-03-b)
* [Part 04](#part-04)
* [Part 05](#part-05)
* [Part 06](#part-06)
* [Part 07](#part-07)
* [Part 08](#part-08)
* [Part 09](#part-09)
* [Part 10](#part-10)
* [Part 11](#part-11)
* [Part 12](#part-12)
* [Part 13](#part-13)
  * [TO THE CLIENT!!!!](#to-the-client)
* [Part-14](#part-14)
* [Part-15](#part-15)
* [Part-16](#part-16)
* [Part-17](#part-17)
* [Part-18](#part-18)
  * [The great redirect](#the-great-redirect)
* [Part-19](#part-19)
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

<!-- /TOC -->

> Example React + Redux codebase that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

# Redux codebase containing real world examples (CRUD, auth, advanced patterns, etc)

Originally created for this [GH issue](https://github.com/reactjs/redux/issues/1353). The codebase is now feature complete and the RFC is open. **Your input is greatly appreciated; please submit bug fixes via pull requests & feedback via issues**.

We're currently working on some docs for the codebase (explaining where functionality is located, how it works, etc) but most things should be self explanatory if you have a minimal understanding of React/Redux.

## Getting started

You can view a live demo over at https://react-redux.realworld.io/

To get the frontend running locally:

* Clone this repo
* `npm install` to install all req'd dependencies
* `npm run watch` to have webpack bundle the JS files into /bin/main.js, then run `npm start`

For convenience, we have a live API server running at https://conduit.productionready.io/api for the application to make requests against. You can view [the API spec here](https://github.com/GoThinkster/productionready/blob/master/API.md) which contains all routes & responses for the server. We'll release the backend code in a few weeks should anyone be interested in it.

## Setup for Front & Backend

* `npm install -g express-generator create-react-app`
* `express killick`
* `cd killick && npm install`
* `create-react-app client-app`
* `cd client-app && npm install -D cross-env`
* client-app package.json

## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication. You can view a live demo over at https://redux.productionready.io/

**General functionality:**

* Authenticate users via JWT (login/signup pages + logout button on settings page)
* CRU\* users (sign up & settings page - no deleting required)
* CRUD Articles
* CR\*D Comments on articles (no updating required)
* GET and display paginated lists of articles
* Favorite articles
* Follow other users

**The general page breakdown looks like this:**

* Home page (URL: /#/ )
  * List of tags
  * List of articles pulled from either Feed, Global, or by Tag
  * Pagination for list of articles
* Sign in/Sign up pages (URL: /#/login, /#/register )
  * Use JWT (store the token in localStorage)
* Settings page (URL: /#/settings )
* Editor page to create/edit articles (URL: /#/editor, /#/editor/article-slug-here )
* Article page (URL: /#/article/article-slug-here )
  * Delete article button (only shown to article's author)
  * Render markdown from server client side
  * Comments section at bottom of page
  * Delete comment button (only shown to comment's author)
* Profile page (URL: /#/@username, /#/@username/favorites )
  * Show basic user info
  * List of articles populated from author's created articles or author's favorited articles

# Part 01

* Wire up redux in the index.js
* `npm install redux react-redux`
* You should now see the app name displayed in your browser!

```html
<link rel="stylesheet" href="//demo.productionready.io/main.css">
    <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
```

```js
//index.js root file
const defaultState = {
  appName: "Meowdium",
  articles: null
};

const reducer = function(state = defaultState, action) {
  return state;
};

const store = createStore(reducer);
...
```

# Part 02

* CSS is imported via a link tag, check our index.html for deets
* Created Feature Home and Header Component
* Header has our navigation stack in it. sweet
* Home has:
  * index
  * MainView that will have your global feed and popular tags
  * Banner, that is just sweet.

```
killick-demo
├── README.md
├── node_modules
├── package.json
├── package-lock.json
├── .gitignore
├── public
│   └── images
│   └── javascript
│   └── stylesheets
└── routes
└── views
└── app.js <--- Express Server/Backend Client
|__ client-app <--- React App/FrontEnd Client
    └── index.css
    └── index.js
    └── registerServiceWorker.js
    └── components
        └── Home
            └── Banner.js
            └── MainView.js
            └── index.js
        └── App.js
```

* then in the App.js file we want to render out our root Home Component

```js
//app.js
class App extends Component {
  render() {
    return <Home />;
  }
}
```

* Ready GO!!!

# Part 03 A

* get monogo running

  * **WINDOWS**

    * `cd C:\`
    * `md \data\db`
    * `"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath C:\data\db`

* db connection
* `npm install mongoose` this is our ORM. Object Relationalskdfs Mapping! install it to the server/backend. _NOT_ the client-app.
* `var mongoose = require("mongoose");` <---import into server app.js

```js
//app.js after view
var isProduction = process.env.NODE_ENV === "production";
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//connect to our database monogo
if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/killick", function(err) {
    if (err) return console.error(err);
    console.log("THE DB, mongo, is connected, and I ROCK");
  });
  mongoose.set("debug", true);
}
```

# Part 03 B

* importing some data...:-)
* `mongorestore -d <database_name> <directory_backup>`
* grab the seed.zip from the repo above. unzip seed and `cd` to that directory **NOT** into it
* **Mac** `mongorestore -d killick seed` be sure to be in the same directory as your data you are trying to import
* **Windows** `"C:\Program Files\MongoDB\Server\3.4\bin\mongorestore.exe" -d killick seed`

# Part 04

* Creating an api-endpoint for articles, so we will do a HTTP GET request to localhost:3000/api/articles and it will hopefully return us a payload of articles. hopfully
* let's move the routing from app.js into `/routes/index.js` like this

```js
//app.js
app.use(require("./routes"));
```

* now all the routing is abstracted out of `app.js` bc it's getting a bit busy

```js
// route/index.js
const router = require("express").Router();
const API = require("./api");

router.use("/api", API); // --> route matching api call that function

module.exports = router; // --> export router so that we can import it in app.js
```

* let's make a folder `/routes/api` and add an `index.js`

```js
// routes/api/index.js
const router = require("express").Router();
const articles = require("./articles");

router.use("/articles", articles);

module.exports = router;
```

* it looks like a lot of unnessary folders, but we are trying to segment off parts of the code, and keep them separate and easy to reason able

```js
// routes/api/articles.js
const router = require("express").Router();

router.get("/", function(req, res, next) {
  //query database here and return payload
});
```

* Use [Postman](https://www.getpostman.com/) to check that this endpoint actually works.

# Part 05

* We need to set up a mongoose schema now, so we can query the db and send back the results. So let's make a folder!!!! `/models` and we'll create our Articles model there `/models/Articles.js`

```js
// /models/Articles.js
const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema({}); //--> takes an object

mongoose.model("Article", ArticleSchema);
```

* The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name. Thus, for the example above, the model Article is for the articles collection in the database. The .model() function makes a copy of schema. Make sure that you've added everything you want to schema before calling .model()!

* now we want to load our Articles model **after** we connect to our mongodb
  `require("./models/Article");`

* Now we can query our Model in the function that is called when our `/api/articles` gets an HTTP request.

```js
// routes/api/articles.js
[...]
const Article = mongoose.model('Article');
[...]
  Article.finde({}).exec()
  .then(results => {
    return res.json({
      articles: results
    })
  })
  .catch(next); //---> where's this go??
```

# Part 06

* Fetching our list of Articles on the client-app, from our newly created API endpoint.
* we'll be leveraging axios, `npm install axios` **IN THE CLIENT-APP**
  * this will give us some added benefits beyond the standar fetch request we'll use later.
  * [axios](https://github.com/axios/axios)
* We want to make http request from several different components, we we are going to set up a services file that will leverage all our http reqeust in a central location.

# Part 07

* we are gonna dispatch an action on 'componentWillMount' for our component onLoad: payload => dispatch({ type: "HOME_PAGE_LOADED", payload })
* Created a middleware.js to handle the Promise with promiseMiddleware. This will be a collection of functions that will run when we dispatch actions, modify it in some way if it meets some conditional, then pass it on to the store via dispatch.
* Redux has a method applyMiddleware which will take functions, and apply them to actions.
* Now we can just pass the promise in a dispatch, and it will be resolved, before headed off to the store for reducing. Sweet!!!
* **GOAL** now we should have our articles conosole logged out if we put console.log(action.paylaod) in our reducer in the root index.js

# Part 08

* Getting and showing the articles list that we now have!
  * Create our ArticleList Component
  * 3 scenarios: we either have articles not existing (fetching from server) or no articles at all.

# Part 09

* ArticlePreview component. BC we want to show more than just the title, right? How many pieces of flair do you wear? Just the minium?
* ArticlePreview will be a shared component that takes article as a prop and returns JSX markup for rendering the preview.
  ![Imgur](https://i.imgur.com/881PwAY.png)

# Part 10

* The great refactor, making room for router
* `npm install react-router-dom`
* Refactor to make room for routing. Remove all store stuff from index.js and place into a new file called store.js.
* Let's add some basic routing for our App and it's nested component. We can't hard code home into anymore(App.js Line 19), because it's not always going to be home, it might be something else, like profile or new article.

# Part 11

* Authorization and Authentication
* We need the backend to be able to
  * sign up new users
  * login existing users
  * Give out a JSON Web Token (JWT) for existing users to make repeated requests [More JWT](https://jwt.io/introduction)
* Backend install `npm install express-jwt jsonwebtoken passport passport-local express-session mongoose-unique-validator crypto dotenv`
* First lets make a user model and get it loaded

```js
// models/User.js
[...]

const UserSchema = new mongoose.Schema{(
  username:String,
  email: String,
  bio: String,
  image: String,
  favorites: ???,
  hash: String, //--> What's this?
  salt: String //--> What's this too?
)}

[...]
```

* Then we can implement passport local strategy [Passport](http://www.passportjs.org/)

```js
// passport/init.js
const local = require("./localStrategy");
const mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = function(passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log("serializing user: ");
    console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log("deserializing user:", user);
      done(err, user);
    });
  });

  // Setting up Passport Strategies for Facebook and Twitter
  local(passport);
};
```

\*

```js
// passport/local.js
passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]"
    },
    function(email, password, done) {
      User.findOne({ email: email })
        .then(function(user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, { errors: { "email or password": "is invalid" } });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
```

* `require('dotenv').config();` this loads our .env file with secrets!

```js
// .env
SUPER_JERK = sodifiondfosndofinsd;
```

* Then we want to be sure to load the passort in app, after db connect, just like we have for User and Articles models.

```js
// app.js
// Configuring Passport
app.use(passport.initialize());
// Initialize Passport
var initPassport = require("./passport/init");
initPassport(passport);
```

* Now let's create a route, an endpoint `/api/users/login` as an HTTP POST for signing up a new user!

```js
// routes/api/users
[...]
router.post('/users/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

[...]
```

* login using the json body below, using just Postman. We haven't built a front end yet, so you know, can't test it that way. lol.

```json
{
  "user": {
    "email": "motorboat@usaa.net",
    "password": "pirate"
  }
}
```

# Part 12

* Now that we can login, we want to be able sign new users.
* should be able to HTTP POST to `localhost:3000/api/users` with a body

```json
{
  "user": {
    "username": "CaptianUnderpants",
    "email": "underpants@juno.net",
    "password": "pirate"
  }
}
```

* We're going to add a POST to our users router like so

```js
// routes/api/users.js
router.post("/users", function(req, res, next) {
  var user = new User(); //---> create a new instance of our User model. Remember the `new` keyword?

  user.username = req.body.user.username; //---> get username
  user.email = req.body.user.email; //---> get email
  user.setPassword(req.body.user.password); //---> where did setPassword come

  user
    .save() //---> save new user to db
    .then(function() {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});
```

* Now we should get a payload back when POST'ing a new user JSON !!!!!!!
* What happens if we try sign up a user again?

# Part 13

## TO THE CLIENT!!!!

* Front end route and Login Form
* Create a Header Component for links for 'Login' and 'Home' that takes props 'appName'

```js
// src/components/Header.js
<Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="login" className="nav-link">
                Sign in
              </Link>
```

* Let's modifiy the App component to handle our new navigation header. We want the nav to **ALWAYS** show up, and then switch on a particular route after than. We've also removed the switch from `index.js`

```js
// src/components/App.js
//we've map app name from redux to props of the app component
<div>
  <Header appName={this.props.appName} />
  <Switch>
    <Route exact path="/" component={Home} />
  </Switch>
</div>
```

# Part-14

* Now we can click to the login page, we need a login component!
* Import it into App.js and add it to the Switch Routing

```js
// src/components/App.js
<Route path="/" component={Login} />
```

# Part-15

* service for POST to api/users/login
* Login methods for `handleOnChange` and `handleOnSubmit`
* dispatch the login service promise as an action to redux
* Tackle the reducer for auth, we should have auth properties username, email, token. These should be available as props on the Login component with successful login. Use any of the credintals that you make from step 12 with Postman.

# Part-16

* create the reducers directory and refactor out the global feed reducer
* common reducer
* auth.js reducer file
* added combineReducer

# Part-17

* List not loading ? Fix that Error!!!!!
  * note. we don't need to wire both `home.index` and `home.MainView` to redux.
  * Just the `home.index` gets mapped to redux, then we pass articles via props.
* Error handling
* ListErrors as a component
* Fix our middleware to handle axios errors

```js
 .catch(error => {
        action.error = true;
        action.payload = error.response.data.errors;
        store.dispatch(action);
      });
```

* ListErrors component will take errors as `props` and render a react component ul element

```js
{
  Object.keys(errors).map(key => {
    return (
      <li key={key}>
        {key} {errors[key]}
      </li>
    );
  });
}
```

```js
//any of the properties on store auth will be spread out to props of the
//login component
const mapStateToProps = state => ({ ...state.auth });
```

* we now have access to `state.auth.inProgress` so we can disable the login button to prevent lots of crazy clicking. `disabled={this.props.inProgress}`

# Part-18

## The great redirect

* `npm install react-router-redux@next history`
* redirect reducer to handle redirect actions, so a component can send an action type 'REDIRECT' and the reducer will handle it and `App.js` will do the actual routing.
* We need to init react-router-redux in our store

```js
//src/store.js
// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

const reducer = combineReducers({
  auth,
  common,
  home,
  router: routerReducer
});
```

* we also need to replace `BrowserRouter as Router` with `ConnectedRouter` from react-router-redux

```js
//src/index.js
  <Provider store={reduxStore}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
    </ConnectedRouter>
  </Provider>,
```

* add Dispatch actions to `App.js`

```js
//components/App.js
const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) => dispatch({ type: "APP_LOAD", payload, token, skipTracking: true }),
  onRedirect: () => dispatch({ type: "REDIRECT" })
});
```

* `App.js` also gets some lifecycle methods `componentWillReceiveProps` & `componentWillMount`

* Lastly in the commone reducer, we want to handle `LOGIN` with a redirect if it's successful, meaing action.error is false.

```js
//reducers/common.js
case "LOGIN": {
      return {
        ...state,
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
        redirectTo: action.error ? null : "/"
      };
```

# Part-19

* Conditionally render the `Header.js` based on if user is logged in our not
* `Header.js` will render LoggedInView or LoggedOutView based on `props.currentUser` that gets passed into it from it's partent component, `App.js`

```js
class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">
          <Link to="/" className="navbar-brand">
            {this.props.appName.toLowerCase()}
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} />
        </div>
      </nav>
    );
  }
}
```

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

* So now are call to `/api/user` as an HTTP PUT should be working, but the page just sits there? mmmmm, why do you think that is? let's tackle that in the next section

* what about the Header component? It's not updating either, until it's refreshed. Can we fix that with a lifecycle method?
