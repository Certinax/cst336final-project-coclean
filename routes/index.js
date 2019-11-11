const MySQL = require('../res/class/mysql/MySQL');
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Final Project",
  });
});

// DB Test page.
router.get('/db_test', (req, res, nex) => {
  const db = new MySQL();
  db.query('SHOW PROCESSLIST', (result) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  });
});

module.exports = router;
