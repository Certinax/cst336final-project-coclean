const express = require("express");
const choreRouter = express.Router();
const chore = require('../../../res/class/api/orm/Chore');
const responseBody = require('../../../res/class/api/orm/ResponseBody');
const crudOperation = require('../../../res/class/api/orm/CrudOperation');


// * Get all chores.
choreRouter.get('/', (req, res, next) => {
	chore.fetchAll((result) => {
		res.json(new responseBody(
			'chore',
			crudOperation.READ,
			Array.isArray(result) && result.length > 0,
			'Chores were successfully fetched.',
			'No chores found.',
			result
		));
	});
});


// * Get specific chore.
choreRouter.get('/:id', (req, res, next) => {
	const {id} = req.params;
	chore.fetch(id, (result) => {
			res.json(new responseBody(
				'chore',
				crudOperation.READ,
				Array.isArray(result) && result.length > 0,
				`Chore (${id}) was successfully fetched.`,
				`Chore (${id}) does not exist.`,
				result
			));
	});
});


// * Create chore.
choreRouter.post('/', (req, res, next) => {
	const {collectiveId, title, description, frequency} = req.body;
	chore.create(collectiveId, title, description, frequency, (result) => {
		if (Array.isArray(result) && result.length > 0) {
			res.json(
				new responseBody(
					'user',
					crudOperation.CREATE,
					result[1][0]["@out"] === 'Chore created!',
					`Chore (${title}) was successfully created`,
					`Chore (${title}) could not be created.`,
					result[1][0]["@out"]
				)
			);
		} else res.json(result);
	});
});


// * Update Chore.
choreRouter.put('/:id', (req, res, next) => {
	const choreId = req.params.id;
	const {title, description, frequency} = req.body;
	chore.edit(choreId, title, description, frequency, (result) => {
		if (Array.isArray(result) && result.length > 0) {
			res.json(new responseBody(
				'chore',
				crudOperation.UPDATE,
				result[1][0]["@out"] === 'Chore updated!',
				`Chore (${title}) was successfully updated`,
				`Chore (${title}) could not be updated.`,
				result
			));
		} else res.json(result);
	});
});


// * Delete Chore.
choreRouter.delete('/:id', (req, res, next) => {
	const choreId = req.params.id;
	chore.delete(choreId, (result) => {
		if (Array.isArray(result) && result.length > 0) {
			res.json(new responseBody(
				'chore',
				crudOperation.DELETE,
				result[1][0]["@out"] === 'Chore deleted!',
				`Chore (id: ${choreId}) was successfully deleted`,
				`Chore (id: ${choreId}) could not be deleted.`,
				result
			));
		} else res.json(result);
	});
});


module.exports = choreRouter;