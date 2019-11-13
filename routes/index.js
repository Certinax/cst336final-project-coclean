const MySQL = require('../res/class/mysql/MySQL');
const User = require('../res/class/orm/User');
const express = require("express");
const router = express.Router();
const apiRouter = require('./api/apiRouter');

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
		'ORM',
		'Hauge',
		'orm@db.com',
		'abc123'
	);

  // TODO: Enable later.
  User.create(user, (out) => {
		console.log(out);
		User.fetchAll((users) => {
			res.json(users);
		});
	});
});

// * API Router.
router.use('/api', apiRouter);

module.exports = router;
