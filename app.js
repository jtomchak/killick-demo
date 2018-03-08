var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");

//Load environmental variables
var isProduction = process.env.NODE_ENV === "production";
require("dotenv").config();

var app = express();

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

//import models as soon as we are connected!!!!!!
require("./models/User");
require("./models/Article");
require("./models/Comments");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// view engine setup
app.use(
  session({
    secret: "killick_cookietown",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

// Configuring Passport
app.use(passport.initialize());
// Initialize Passport
var initPassport = require("./passport/init");
initPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/*
*Here are the routes
*
*
*/
app.use(require("./routes"));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client-app/build/index.html"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
