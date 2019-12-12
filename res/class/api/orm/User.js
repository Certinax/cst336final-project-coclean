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
	 * @param {number} id
	 * @param {function} callback
	 * @example
	 * fetch(1, (user) => {
	 *   console.log(user.getName())
	 * });
	 */
	static fetch(id, callback) {

		// Define SQL query.
		const sql = 'SELECT * FROM User WHERE `ID` = ?;';

		// Execute query.
		db.prep(sql, [id])
			.then((resolved) => {
				// ? If the resolved value is an array.
				if (Array.isArray(resolved)) {
					// ? If the query returned any results.
					if (resolved.length > 0) {
						callback(resolved);
					} else {
						console.error(
							`MySQL: User with email (${id}) does not exist.`
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
	 * @param {number} args.id
	 * @param {string} args.name
	 * @param {string} args.surname
	 * @param {string} args.email
	 * @param {string} args.oldPassword
	 * @param {string} args.newPassword
	 * @param {function} callback
	 */
	static edit({id, name, surname, email, oldPassword, newPassword}, callback) {
		oldPassword = mysql.SHA256(oldPassword);
		newPassword = mysql.SHA256(newPassword);
		const sql = `CALL edit_user("${id}", "${name}","${surname}","${email}","${oldPassword}","${newPassword}",@out); SELECT @out;`;
		db.query(sql)
			.then(res => {
				callback(res);
			}).catch(err => {
			callback([]);
		});
	}


	/**
	 * Delete
	 * @param {number} id
	 * @param {string} password
	 * @param {function} callback
	 */
	static delete(id, password, callback) {
		password = mysql.SHA256(password);
		const sql = `CALL delete_user(${id},"${password}",@out); SELECT @out;`;
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
		const sql = 'SELECT * FROM `User` WHERE `email` = ?;';
		db.prep(sql, [email]).then((resolved) => {
			callback(resolved);
		}).catch((error) => {
			callback(error);
		})
	}
}

module.exports = User;