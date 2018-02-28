const router = require("express").Router();
const mongoose = require("mongoose");
const Article = mongoose.model("Article");

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

module.exports = router;
