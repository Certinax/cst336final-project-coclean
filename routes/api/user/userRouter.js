const MySQL = require('../../../res/class/mysql/MySQL');
const User = require('../../../res/class/orm/User');
const express = require("express");
const user = express.Router();
const StatusObject = require('../../../res/class/api/StatusObject');

// * Get all users.
user.get('/', (req, res, next) => {
	User.fetchAll((result) => {
		const argValidate = {
			successCondition: result !== '[]',
			operation: 'get',
			entity: 'user',
			successText: `All users were successfully fetched.`,
			failText: `There are no users in the database.`,
		};
		StatusObject.validate(argValidate, (status) => {
			const argProcess = {
				mysqlResult: result,
				statusObject: status
			};
			StatusObject.produce(argProcess, (out) => {
				console.log(out);
				res.json(out);
			});
		});
	})
});

// * Get specific user.
user.get('/:email', (req, res, next) => {
	const {email} = req.params;
	User.fetch(email, (result) => {
		const argValidate = {
			successCondition: result !== '[]',
			operation: 'get',
			entity: 'user',
			successText: `User (${email}) was successfully fetched`,
			failText: `User (${email}) was not found.`,
		};
		StatusObject.validate(argValidate, (status) => {
			const argProcess = {
				mysqlResult: result,
				statusObject: status
			};
			StatusObject.produce(argProcess, (out) => {
				console.log(out);
				res.json(out);
			});
		});
	});
});

// * Create user.
user.post('/', (req, res, next) => {
	const {name,surname,email,password} = req.body;
	const argUser = {
		name: name,
		surname: surname,
		email: email,
		password: password
	};
	User.create(argUser, (result) => {
		const argValidate = {
			successCondition: result[1][0]["@out"] === 'User created!',
			operation: 'create',
			entity: 'user',
			successText: `User (${email}) was successfully created`,
			failText: `Email (${email}) has already been taken.`,
		};
		StatusObject.validate(argValidate, (status) => {
			const argProcess = {
				mysqlResult: result,
				statusObject: status
			};
			StatusObject.produce(argProcess, (out) => {
				console.log(out);
				res.json(out);
			});
		});
	});
});

// * Update user.
user.put('/:email/:password', (req, res, next) => {
	const {email, password} = req.params;
	const body = req.body;
	User.fetch(email, (user) => {
		if (user.length > 0) {
			const loginMatch = email === user[0].email && password === user[0].password;
			if (loginMatch) {
				User.edit(body, (result) => {
					const argValidate = {
						successCondition: result[1][0]["@out"] === 'User updated!',
						operation: 'update',
						entity: 'user',
						successText: `User (${email}) was successfully updated.`,
						failText: `User (${email}) was not updated. Wrong email or password.`,
					};
					StatusObject.validate(argValidate, (status) => {
						const argProcess = {
							mysqlResult: result,
							statusObject: status
						};
						StatusObject.produce(argProcess, (out) => {
							console.log(out);
							res.json(out);
						});
					});
				});
			} else {
				const argValidate = {
					successCondition: loginMatch,
					operation: 'update',
					entity: 'user',
					successText: `User (${email}) was successfully updated.`,
					failText: `User (${email}) was not updated. Wrong email or password.`,
				};
				StatusObject.validate(argValidate, (status) => {
					const argProcess = {
						mysqlResult: [],
						statusObject: status
					};
					StatusObject.produce(argProcess, (out) => {
						console.log(out);
						res.json(out);
					});
				});
			}
		}
	});
});

// * Delete user.
user.delete('/:email/:password', (req, res, next) => {
	const {email, password} = req.params;
	const credentials = {email: email, password: password};
	User.delete(credentials, (result) => {
		const argValidate = {
			successCondition: result[1][0]["@out"] === 'User deleted!',
			operation: 'delete',
			entity: 'user',
			successText: `User (${email}) was successfully deleted`,
			failText: `User (${email}) was not deleted. Wrong email or password.`,
		};
		StatusObject.validate(argValidate, (status) => {
			const argProcess = {
				mysqlResult: result,
				statusObject: status
			};
			StatusObject.produce(argProcess, (out) => {
				console.log(out);
				res.json(out);
			});
		});
	});
});

module.exports = user;