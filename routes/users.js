var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/pants", function(req, res, next) {
  res.send("also a response");
});
module.exports = router;
