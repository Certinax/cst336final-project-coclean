const MySQL = require('../../../res/class/mysql/MySQL');
const User = require('../../../res/class/orm/User');
const express = require("express");
const user = express.Router();

// * Get all users.
user.get('/', (req, res, next) => {
	const db = new MySQL();
	User.fetchAll((users) => {
		res.json(users);
	})
});

// * Get specific user.
user.get('/*', (req, res, next) => {
	const userId = req.originalUrl.toString().match(/\d+/)[0];
	const db = new MySQL();
	User.fetch(userId,(user) => {
		res.json(user);
	})
});

module.exports = user;