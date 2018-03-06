var express = require("express");
var router = express.Router();
let api = require("./api");

router.use("/api", api);

module.exports = router;
