// var express = require("express");
// var router = express.Router()

const router = require("express").Router();

router.use("/articles", require("./articles"));

module.exports = router;
