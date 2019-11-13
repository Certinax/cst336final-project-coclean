const MySQL = require('../mysql/MySQL');

/**
 * User
 * @author Isak Hauge
 */
class User {

	/**
	 * Constructor
	 * @param {string} name
	 * @param {string} surname
	 * @param {string} email
	 * @param {string} password
	 */
	constructor(name, surname, email, password) {

		/**@type{string}*/
		this._name = name;

		/**@type{string}*/
		this._surname = surname;

		/**@type{string}*/
		this._email = email;

		/**@type{string}*/
		this._password = password;
	}


	/**
	 * Getter: Name
	 * @returns {string}
	 */
	getName() {
		return this._name;
	}


	/**
	 * Setter: Name
	 * @param {string} name
	 * @returns {User}
	 */
	setName(name) {
		this._name = name;
		return this;
	}


	/**
	 * Getter: Surname
	 * @returns {string}
	 */
	getSurname() {
		return this._surname;
	}


	/**
	 * Setter: Surname
	 * @param {string} surname
	 * @returns {User}
	 */
	setSurname(surname) {
		this._surname = surname;
		return this;
	}


	/**
	 * Getter: Email
	 * @returns {string}
	 */
	getEmail() {
		return this._email;
	}


	/**
	 * Setter: Email
	 * @param {string} email
	 * @returns {User}
	 */
	setEmail(email) {
		this._email = email;
		return this;
	}


	/**
	 * Getter: Password
	 * @returns {string}
	 */
	getPassword() {
		return this._password;
	}


	/**
	 * Setter: Password
	 * @param {string} password
	 * @returns {User}
	 */
	setPassword(password) {
		this._password = password;
		return this;
	}


	/**
	 * Fetch
	 * @param id
	 * @param {function} callback
	 * @example
	 * fetch(1, (user) => {
	 *   console.log(user.getName())
	 * });
	 */
	static fetch(id, callback) {

		// Instantiate MySQL object.
		const db = new MySQL();

		// Define SQL query.
		const sql = `SELECT * FROM User WHERE ID = ${id};`;

		// Execute query.
		db.query(sql, (result) => {
			// ? If the query returned any results.
			if (result.length > 0) {
				const user = result[0];
				callback(
					new User(
						user.name,
						user.surname,
						user.email,
						user.password
					)
				);
			} else {
				console.error(
					`MySQL: User with ID ${id} does not exist.`
				);
				callback([]);
			}
		});
	}


	/**
	 * Fetch All
	 * @param {function} callback
	 */
	static fetchAll(callback) {
		const db = new MySQL();
		const sql = 'SELECT * FROM User;';
		db.query(sql, (result) => {
			callback(result);
		});
	}


	/**
	 * Create
	 * @param {User} user
	 * @param {function} callback
	 */
	static create(user, callback) {
		const db = new MySQL();
		let sql = 'USE ' + db.envCredentials.database + ';\n';
		sql += 'CALL new_user(';
		sql += `"${user.getName()}", `;
		sql += `"${user.getSurname()}", `;
		sql += `"${user.getEmail()}", `;
		sql += `"${user.getPassword()}", `;
		sql += '@out);\n';
		sql += 'SELECT @out;';
		console.log(sql);
		db.query(sql, (result) => {
			console.log(result);
			callback(result);
		});
	}
}

module.exports = User;