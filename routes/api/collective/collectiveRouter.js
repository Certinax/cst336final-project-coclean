const express = require("express");
const collectiveApi = express.Router();
const collective = require('../../../res/class/api/orm/Collective');
const responseBody = require('../../../res/class/api/orm/ResponseBody');
const crudOperation = require('../../../res/class/api/orm/CrudOperation');
const mysql = require('../../../res/class/mysql/MySQL');


// * Get all collectives.
collectiveApi.get('/', (req, res, next) => {
	collective.fetchAll((result) => {
		res.json(new responseBody(
			'collective',
			crudOperation.READ,
			Array.isArray(result) && result.length > 0,
			`Collectives were successfully fetched.`,
			`There are no collectives.`,
			result
		));
	});
});


// * Get specific collective.
collectiveApi.get('/:id', (req, res, next) => {
	const {id} = req.params;
	collective.fetch(id, (result) => {
		if (result.length > 0) {
			res.json(new responseBody(
				'collective',
				crudOperation.READ,
				result.length > 0,
				`Collective (id: ${id}) was successfully fetched.`,
				`Collective (id: ${id}) does not exist.`,
				result
			));
		} else res.json(result);
	});
});


// * Create collective.
collectiveApi.post('/', (req, res, next) => {
	const {name, description, school, userId} = req.body;
	collective.create(name, description, school, userId, (result) => {
		if (result.length > 0) {
			res.json(new responseBody(
				'collective',
				crudOperation.CREATE,
				result[1][0]["@out"] === 'Collective created!',
				`Collective (${name}) was successfully created.`,
				`Collective (${name}) could not be created. Reason: ${result[1][0]['@out']}`,
				result
			));
		} else res.json(result);
	});
});


// * Update user.
collectiveApi.put('/:id', (req, res, next) => {
	const {id} = req.params;
	const {name, description, school} = req.body;
	collective.edit(id, name, description, school, (result) => {
		if (result.length > 0) {
			res.json(new responseBody(
				'collective',
				crudOperation.UPDATE,
				result[1][0]["@out"] === 'Collective updated!',
				`Collective (${name}) was successfully updated.`,
				`Collective (${name}) could not be updated. Reason: ${result[1][0]['@out']}`,
				result
			));
		} else res.json(result);
	});
});


// * Delete user.
collectiveApi.delete('/:id', (req, res, next) => {
	const {id} = req.params;
	collective.delete(id, (result) => {
		if (result.length > 0) {
			res.json(new responseBody(
				'collective',
				crudOperation.DELETE,
				result[1][0]["@out"] === 'Collective deleted!',
				`Collective (id: ${id}) was successfully deleted.`,
				`Collective (id: ${id}) could not be deleted. Reason: ${result[1][0]['@out']}`,
				result
			));
		} else res.json(result);
	});
});


collectiveApi.get('/:id/chore', (req, res, next) => {
	const id = req.params.id;
	collective.getChores(id, (result) => {
		res.json(result);
	});
});


module.exports = collectiveApi;