const router = require("express").Router();
const mongoose = require("mongoose");
const Article = mongoose.model("Article");
const User = mongoose.model("User");
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

module.exports = router;
