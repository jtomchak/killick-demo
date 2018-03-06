//example of creating multiple variables at once.
const mongoose = require("mongoose"),
  router = require("express").Router(),
  passport = require("passport"),
  User = mongoose.model("User");
var auth = require("../auth");

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

//User Login
router.post("/users/login", function(req, res, next) {
  console.log(req.body);
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate("local", { session: false }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

//User Update Profile
router.put("/user", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...check them all!
      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== "undefined") {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.bio !== "undefined") {
        user.bio = req.body.user.bio;
      }
      if (typeof req.body.user.image !== "undefined") {
        user.image = req.body.user.image;
      }
      if (typeof req.body.user.password !== "undefined") {
        user.setPassword(req.body.user.password);
      }

      //now save updated user properties to db and return payload to client
      return user.save().then(function() {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

//User Sign up
router.post("/users", function(req, res, next) {
  var user = new User(); //---> create a new instance of our User model. Remember the `new` keyword?

  user.username = req.body.user.username; //---> get username
  user.email = req.body.user.email; //---> get email
  user.password = req.body.user.password; //---> DON'T SAVE PASSWORD TO DB!!!!!

  user
    .save() //---> save new user to db
    .then(function() {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

module.exports = router;
