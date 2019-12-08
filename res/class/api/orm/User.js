require('dotenv').config();
const mysql = require('../../mysql/MySQL');
const mysqlCredentials = require('../../mysql/MysqlCredentials');

const db = mysql.getInstance(new mysqlCredentials(
	process.env.DB_HOST,
	process.env.DB_USER,
	process.env.DB_PASS,
	process.env.DB_NAME
));

/**
 * User
 * @author Isak Hauge
 */
class User {

	/**
	 * Fetch
	 * @param email
	 * @param {function} callback
	 * @example
	 * fetch(1, (user) => {
	 *   console.log(user.getName())
	 * });
	 */
	static fetch(email, callback) {

		// Define SQL query.
		const sql = 'SELECT * FROM User WHERE email = ?;';

		// Execute query.
		db.prep(sql, [email])
			.then((resolved) => {
				// ? If the resolved value is an array.
				if (Array.isArray(resolved)) {
					// ? If the query returned any results.
					if (resolved.length > 0) {
						callback(resolved);
					} else {
						console.error(
							`MySQL: User with email (${email}) does not exist.`
						);
						callback([]);
					}
				} else callback([]);
			}).catch(err => {
			callback([]);
		});
	}


	/**
	 * Fetch All
	 * @param {function} callback
	 */
	static fetchAll(callback) {
		const sql = 'SELECT * FROM User;';
		db.query(sql)
			.then((resolved) => {
				if (typeof resolved === 'object')
					callback(resolved);
			}).catch(err => {
			callback([]);
		});
	}


	/**
	 * Create
	 * @param {object} args
	 * @param {string} args.name
	 * @param {string} args.surname
	 * @param {string} args.email
	 * @param {string} args.password
	 * @param {function} callback
	 */
	static create({name, surname, email, password}, callback) {
		password = mysql.SHA256(password);
		const sql = `CALL new_user("${name}","${surname}","${email}","${password}",@out); SELECT @out;`;
		db.query(sql)
			.then(res => {
				callback(res);
			}).catch(err => {
			callback([]);
		});
	}


	/**
	 * Edit
	 * @param {object} args
	 * @param {string} args.name
	 * @param {string} args.surname
	 * @param {string} args.email
	 * @param {string} args.newPassword
	 * @param {function} callback
	 */
	static edit({name, surname, email, newPassword}, callback) {
		newPassword = mysql.SHA256(newPassword);
		const sql = `CALL edit_user("${name}","${surname}","${email}","${newPassword}",@out); SELECT @out;`;
		db.query(sql)
			.then(res => {
				callback(res);
			}).catch(err => {
			callback([]);
		});
	}


	/**
	 * Delete
	 * @param {object} credentials
	 * @param {string} credentials.email
	 * @param {string} credentials.password
	 * @param {function} callback
	 */
	static delete({email, password}, callback) {
		const sql = `CALL delete_user("${email}","${password}",@out); SELECT @out;`;
		db.query(sql)
			.then(res => {
				callback(res);
			}).catch(err => {
			callback([]);
		});
	}


	/**
	 * Login
	 * @param {object} credentials
	 * @param {string} credentials.email
	 * @param {string} credentials.password
	 * @param {function} callback
	 */
	static login({email, password}, callback) {
		User.fetch(email, (result) => {
			if (result.length === 0)
				callback(false);
			else callback(result);
		});
	}
}

module.exports = User;