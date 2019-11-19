const express = require("express");
const userApi = express.Router();
const user = require('../../../res/class/api/orm/User');
const statusObject = require('../../../res/class/api/StatusObject');
const responseBody = require('../../../res/class/api/orm/ResponseBody');
const crudOperation = require('../../../res/class/api/orm/CrudOperation');

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
	const requestBody = {
		name: name,
		surname: surname,
		email: email,
		password: password
	};
	user.create(requestBody, (result) => {
		if (!result) res.json([]);
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
	});
});

// * Update user.
// TODO: Fix error handling.
userApi.put('/:email/:password', (req, res, next) => {
	const {email, password} = req.params;
	user.fetch(email, (user) => {
		console.log(user[0]);
		if (!user || user.length < 1) res.json([]);
		const loginMatch = email === user[0].email && password === user[0].password;
		if (loginMatch) {
			user.edit(req.body, (result) => {
				if (!result) res.json([]);
				res.json(
					new responseBody(
						'user',
						crudOperation.UPDATE,
						result[1][0]["@out"] === 'User updated!',
						`User (${email}) was successfully updated.`,
						`User (${email}) was not updated. Wrong email or password.`,
						result[1][0]["@out"]
					)
				);
			});
		} else {
			res.json(
				new responseBody(
					'user',
					crudOperation.UPDATE,
					loginMatch,
					'',
					'Login incorrect.',
					[],
				)
			);
		}
	});
});

// * Delete user.
// TODO: Fix error handling.
userApi.delete('/:email/:password', (req, res, next) => {
	const {email, password} = req.params;
	const credentials = {email: email, password: password};
	user.delete(credentials, (result) => {
		const argValidate = {
			successCondition: result[1][0]["@out"] === 'User deleted!',
			operation: 'delete',
			entity: 'user',
			successText: `User (${email}) was successfully deleted`,
			failText: `User (${email}) was not deleted. Wrong email or password.`,
		};
		statusObject.validate(argValidate, (status) => {
			const argProcess = {
				mysqlResult: result,
				statusObject: status
			};
			statusObject.produce(argProcess, (out) => {
				console.log(out);
				res.json(out);
			});
		});
	});
});

module.exports = userApi;