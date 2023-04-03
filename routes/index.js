var express = require("express");
var router = express.Router();

const displayController = require("../controllers/displayController");

/* GET home page. */
router.get("/", displayController.index);

module.exports = router;
