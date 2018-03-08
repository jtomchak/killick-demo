const router = require("express").Router();
const mongoose = require("mongoose");
const Article = mongoose.model("Article");
const User = mongoose.model("User");
const Comment = mongoose.model("Comment");
const auth = require("../auth");

// Preload article objects on routes with ':article'
router.param("article", function(req, res, next, slug) {
  Article.findOne({ slug: slug })
    .populate("author")
    .then(function(article) {
      if (!article) {
        return res.sendStatus(404);
      }
      req.article = article;

      return next();
    })
    .catch(next);
});

router.get("/", function(req, res, next) {
  //this is where we'd query db, give all the articles
  // get the results
  //and send them back
  //db.getCollection('articles').find({})
  Article.find()
    .limit(5)
    .exec()
    .then(results => {
      return res.json({
        articles: results
      });
    })
    .catch(next);
});

// return a article by slug-id, we also want to get user who is actually signed in.
router.get("/:article", auth.optional, function(req, res, next) {
  Promise.all([req.article.populate("author").execPopulate()])
    .then(function(results) {
      return res.json({ article: req.article.toJSONFor() });
    })
    .catch(next);
});

// return an article's comments
router.get("/:article/comments", auth.optional, function(req, res, next) {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
    .then(function(user) {
      return req.article
        .populate({
          path: "comments",
          populate: {
            path: "author"
          },
          options: {
            sort: {
              createdAt: "desc"
            }
          }
        })
        .execPopulate()
        .then(function(article) {
          return res.json({
            comments: req.article.comments.map(function(comment) {
              return comment.toJSONFor();
            })
          });
        });
    })
    .catch(next);
});

// create a new comment
router.post("/:article/comments", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      var comment = new Comment(req.body.comment);
      comment.article = req.article;
      comment.author = user;
      /*
      Save comment, on success, we want to add the newly created 
      comment Object_id to the comments property
      of that specific article, that is an array, so we use push
      */
      return comment.save().then(function() {
        req.article.comments.push(comment);

        /*
        Once that comment Object_id is added to the article 
        we need to save that.

        */
        return req.article.save().then(function(article) {
          res.json({ comment: comment.toJSONFor() });
        });
      });
    })
    .catch(next); //--> if any of our saves/querys fail it triggers the catch
});

module.exports = router;
