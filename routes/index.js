const MySQL = require('../res/class/mysql/MySQL');
const User = require('../res/class/orm/User');
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Final Project",
  });
});

// DB Test route.
router.get('/db_test', (req, res, nex) => {
  const db = new MySQL();
  db.query('SHOW PROCESSLIST', (result) => {
    res.json(result);
  });
});

// ORM Test Route
router.get('/orm', (req, res, next) => {
  const user = new User(
  	1,
		'ORM',
		'Hauge',
		'orm@db.com',
		'abc123'
	);

  User.fetchAll((users) => {
  	res.json(users);
	});

  // TODO: Enable later.
  // User.create(user, (out) => {
	// 	console.log(out);
	// 	User.fetchAll((users) => {
	// 		res.json(users);
	// 	});
	// });
});

module.exports = router;
