const express = require("express");
const userApi = express.Router();
const user = require('../../../res/class/api/orm/User');
const responseBody = require('../../../res/class/api/orm/ResponseBody');
const crudOperation = require('../../../res/class/api/orm/CrudOperation');
const mysql = require('../../../res/class/mysql/MySQL');


// * Get all users.
userApi.get('/', (req, res, next) => {
	user.fetchAll((result) => {
		res.json(
			new responseBody(
				'user',
				crudOperation.READ,
				Array.isArray(result) && result.length > 0,
				`${result.length} users were successfully fetched from the database.`,
				'No users found.',
				result,
			)
		);
	})
});


// * Get specific user.
userApi.get('/:email', (req, res, next) => {
	const {email} = req.params;
	user.fetch(email, (result) => {
		if (!result) res.json([]);
		res.json(
			new responseBody(
				'user',
				crudOperation.READ,
				Array.isArray(result) && result.length > 0,
				`User (${email}) was successfully fetched`,
				`User (${email}) was not found.`,
				result
			)
		);
	});
});


// * Create user.
userApi.post('/', (req, res, next) => {
	const {name,surname,email,password} = req.body;
	user.create({name,surname,email,password}, (result) => {
		if (!result) res.json([]);
		else {
			res.json(
				new responseBody(
					'user',
					crudOperation.CREATE,
					result[1][0]["@out"] === 'User created!',
					`User (${email}) was successfully created`,
					`Email (${email}) has already been taken.`,
					result[1][0]["@out"]
				)
			);
		}
	});
});


// * Update user.
userApi.put('/:email', (req, res, next) => {
	const {email} = req.params;
	const {name, surname, newPassword} = req.body;
	user.edit({name,surname,email,newPassword}, (result) => {
		res.json(new responseBody(
			'user',
			crudOperation.UPDATE,
			result[1][0]["@out"] === 'User updated!',
			`User (${email}) was successfully updated!`,
			`User (${email}) was not updated!`,
			result
		));
	});
});


// * Delete user.
userApi.delete('/:email', (req, res, next) => {
	const email = req.params.email;
	const password = mysql.SHA256(req.body.password);
	user.delete({email,password}, (result) => {
		res.json(new responseBody(
			'user',
			crudOperation.DELETE,
			result[1][0]["@out"] === 'User deleted!',
			`User (${email}) was successfully deleted!`,
			`Incorrect credentials for user (${email})`,
			result
		));
	});
});


// * User login.
userApi.post('/login/:email', (req, res, next) => {
	user.login({email: req.params.email, password: req.body.password}, (result) => {
		const email = req.params.email;
		const password = mysql.SHA256(req.body.password);
		if (result === false || password !== result[0].password) {
			res.json(new responseBody(
				'user',
				crudOperation.READ,
				false,
				'',
				`User (${email}) entered wrong login credentials.`,
				false
			));
		} else {
			res.json(new responseBody(
				'user',
				crudOperation.READ,
				(password === result[0].password),
				`User (${email}) successfully logged in.`,
				`User (${email}) entered the wrong login credentials.`,
				result,
			));
		}
	});
});

module.exports = userApi;