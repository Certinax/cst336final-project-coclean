const express = require("express");
const userApi = express.Router();
const user = require('../../../res/class/api/orm/User');
const responseBody = require('../../../res/class/api/orm/ResponseBody');
const crudOperation = require('../../../res/class/api/orm/CrudOperation');
const mysql = require('../../../res/class/mysql/MySQL');


// * Get All Users.
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


// * Get Specific User.
userApi.get('/:id', (req, res, next) => {
	const {id} = req.params;
	user.fetch(id, (result) => {
		if (!result) res.json([]);
		res.json(
			new responseBody(
				'user',
				crudOperation.READ,
				Array.isArray(result) && result.length > 0,
				`User (id: ${id}) was successfully fetched`,
				`User (id: ${id}) was not found.`,
				result
			)
		);
	});
});


// * Create User.
userApi.post('/', (req, res, next) => {
	const {name,surname,email,password} = req.body;
	user.create(name,surname,email,password, (result) => {
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


// * Update User.
userApi.put('/:id', (req, res, next) => {
	const {id} = req.params;
	const {name, surname, email, oldPassword, newPassword} = req.body;
	user.edit(id,name,surname,email,oldPassword,newPassword, (result) => {
		res.json(new responseBody(
			'user',
			crudOperation.UPDATE,
			result[1][0]["@out"] === 'User updated!',
			`User (id: ${id}) was successfully updated!`,
			`User (id: ${id}) was not updated!`,
			result
		));
	});
});


// * Delete User.
userApi.delete('/:id', (req, res, next) => {
	const id = req.params.id;
	const password = req.body.password;
	user.delete(id, password, (result) => {
		res.json(new responseBody(
			'user',
			crudOperation.DELETE,
			result[1][0]["@out"] === 'User deleted!',
			`User (id: ${id}) was successfully deleted!`,
			`Incorrect credentials for user (id: ${id})`,
			result
		));
	});
});


// * User Login.
userApi.post('/login/', (req, res, next) => {
	const {email, password} = req.body;
	user.login(email, password, (result) => {
		if (Array.isArray(result) && result.length > 0) {
			const trialPassword = mysql.SHA256(password);
			const existingPassword = result[0]['password'];
			user.isInCollective(result[0]['ID'], (isInCollectiveRes) => {
				result[0]['isInCollective'] = isInCollectiveRes[0]['in_collective'];
				res.json(new responseBody(
					'user',
					crudOperation.READ,
					(trialPassword === existingPassword),
					`User (${email}) successfully entered correct login credentials.`,
					`User (${email}) entered the wrong login credentials.`,
					(trialPassword === existingPassword) ? result[0] : []
				));
			});
		} else {
			res.json(new responseBody(
				'user',
				crudOperation.READ,
				false,
				'',
				`User (${req.body.email}) does not exist.`,
				[]
			));
		}
	});
});


// * Make user join collective.
userApi.post('/:id/join', (req,res,next) => {
	const id = req.params.id;
	user.joinCollective(id, req.body.key, (result) => {
		res.json(new responseBody(
			'user',
			crudOperation.UPDATE,
			Array.isArray(result) && result.length > 0 && result[1][0]['@out'] === 'User added to collective!',
			`User (id: ${id}) successfully added to collective.`,
			`User (id: ${id}) could not be added to the collective.`,
			result
		));
	});
});


// * Make user leave collective
userApi.post('/:id/leave', (req,res,next) => {
	const id = req.params.id;
	user.leaveCollective(id, req.body.collectiveId, (result) => {
		res.json(new responseBody(
			'user',
			crudOperation.UPDATE,
			Array.isArray(result) && result.length > 0 && result[1][0]['@out'] === 'User removed from collective.',
			`User (id: ${id}) successfully removed from the collective.`,
			`User (id: ${id}) could not be removed from the collective.`,
			result
		));
	});
});


// * Get user's collective.
userApi.get('/:id/collective', (req, res, next) => {
	const id = req.params.id;
	user.getCollective(id, (result) => {
		res.json(new responseBody(
			'collective',
			crudOperation.READ,
			Array.isArray(result) && result.length > 0,
			result.length + ' collective(s) was successfully fetched.',
			'The user is not a member of a collective.',
			result
		));
	});
});


// TODO: Fix
userApi.get('/:id/collective/chore', (req, res, next) => {
	user.getCollective(req.params.id, (result) => {
		res.json(result);
	});
});

module.exports = userApi;