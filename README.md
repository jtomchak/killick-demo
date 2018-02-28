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
* [Part 07 **HELP ME**](#part-07-help-me)

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

# Part 07 **HELP ME**

* we are gonna dispatch an action on 'componentWillMount' for our component onLoad: payload => dispatch({ type: "HOME_PAGE_LOADED", payload })
* Created a middleware.js to handle the Promise with promiseMiddleware. This will be a collection of functions that will run when we dispatch actions, modify it in some way if it meets some conditional, then pass it on to the store via dispatch.
* Redux has a method applyMiddleware which will take functions, and apply them to actions.
* Now we can just pass the promise in a dispatch, and it will be resolved, before headed off to the store for reducing. Sweet!!!
* **GOAL** now we should have our articles conosole logged out if we put console.log(action.paylaod) in our reducer in the root index.js