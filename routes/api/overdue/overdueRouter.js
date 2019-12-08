const express = require("express");
const overdueApi = express.Router();
const responseBody = require('../../../res/class/api/orm/ResponseBody');
const crudOperation = require('../../../res/class/api/orm/CrudOperation');
const mysql = require('../../../res/class/mysql/MySQL');
const mysqlCredentials = require('../../../res/class/mysql/MysqlCredentials');

const db = mysql.getInstance(new mysqlCredentials(
	process.env.DB_HOST,
	process.env.DB_USER,
	process.env.DB_PASS,
	process.env.DB_NAME
));


// * Get all collectives.
overdueApi.get('/', (req, res, next) => {
	const sql = 'SELECT * FROM `Overdue`;';
	db.query(sql).then((resolved) => {
		res.json(new responseBody(
			'overdue',
			crudOperation.READ,
			Array.isArray(resolved) && resolved.length > 0,
			'All overdue chores were successfully fetched.',
			'There are no overdue chores.',
			resolved
		));
	}).catch((error) => {
		res.json(error);
	});
});


// * Get specific collective.
overdueApi.get('/:id', (req, res, next) => {

});


module.exports = overdueApi;