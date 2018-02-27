const router = require("express").Router();

router.get("/", function(req, res, next) {
  //this is where we'd query db, give all the articles
  // get the results
  //and send them back
  return res.json({ response: "Yep, articles, working on it." });
});

module.exports = router;
