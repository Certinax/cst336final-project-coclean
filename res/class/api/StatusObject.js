/**
 * StatusObject
 * @author Isak Hauge
 */
class StatusObject {
	/**
	 * Constructor
	 * @param {string} operation
	 * @param {string} entity
	 * @param {boolean} success
	 * @param {string} text
	 */
	constructor(operation, entity, success, text) {
		this.status = {
			operation: operation,
			entity: entity,
			success: success
		};
		this.text = text;
	}

	/**
	 * Validate
	 * This function shall generate a StatusObject in accordance with a boolean validation.
	 * @param {object} arg
	 * @param {boolean} arg.successCondition
	 * @param {string} arg.operation
	 * @param {string} arg.entity
	 * @param {string} arg.successText
	 * @param {string} arg.failText
	 * @param {function} callback
	 */
	static validate({successCondition, operation, entity, successText, failText}, callback) {
		if (successCondition) {
			callback(new StatusObject(
				operation,
				entity,
				successCondition,
				successText,
			));
		} else {
			callback(new StatusObject(
				operation,
				entity,
				successCondition,
				failText,
			));
		}
	}

	/**
	 * Produce
	 * This function shall produce a general object
	 * to output in the REST API output to the browser.
	 * @param {object} arg
	 * @param {object} arg.mysqlResult
	 * @param {StatusObject} arg.statusObject
	 * @param {function} callback
	 */
	static produce({mysqlResult, statusObject}, callback) {
		callback({
			meta: statusObject,
			result: mysqlResult
		});
	}
}

module.exports = StatusObject;