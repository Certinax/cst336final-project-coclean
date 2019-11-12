const mysql = require('mysql2');
require('dotenv').config();

/**
 * MySQL
 * @author Isak Hauge
 */
class MySQL {

	/**
	 * Singleton instance variable.
	 * @type {MySQL}
	 */
	static instance;


	/**
	 * Constructor
	 */
	constructor() {

		// ? If MySQL instance is an MySQL instance.
		if (MySQL.instance instanceof MySQL) {

			// ? If the existing instance is connected.
			if (MySQL.instance.isConnected())
				console.log('MySQL: Connected as ID ' + MySQL.instance.connection.threadId);
			else {
				MySQL.instance.connect();
			}

			// Return existing instance.
			return MySQL.instance;

		} else {

			// Create connection object.
			this._connection = mysql.createConnection(this.envCredentials);

			// Assign this instance to the class instance variable.
			MySQL.instance = this;

			// Return the new instance.
			return MySQL.instance;
		}
	}


	/**
	 * Getter: Connection.
	 * @returns {Connection}
	 */
	get connection() {
		return this._connection;
	}


	/**
	 * Connect.
	 */
	connect() {
		if (!this.isConnected()) {
			this.connection.connect((err) => {
				if (err) {
					console.error(err.stack);
				} else {
					console.log('MySQL: New connection as ID ' + this.connection.threadId)
				}
			});
		} else {
			console.log('MySQL: Connection as ID ' + this.connection.threadId)
		}
	}


	/**
	 * Disconnect.
	 */
	disconnect() {
		if (this.isConnected())
			this.connection.end();
	}


	/**
	 * Is Connected.
	 * @returns {boolean}
	 */
	isConnected() {
		return this.connection.state !== 'disconnected';
	}


	/**
	 * Query
	 * @param {string} sql
	 * @param {function} callback
	 * @example {
	 *   query('select * from User', function(result) {
	 *     console.log(result);
	 *   });
	 * }
	 */
	query(sql, callback) {
		// ? If the MySQL object is not connected.
		if (!this.isConnected())
			this.connect();

		// Invoke SQL query.
		this.connection.query(sql, (err, result) => {

			// ? If there are any errors related to the query.
			if (err) {
				console.error(err.stack);
				return; // Terminate.
			}
			callback(result);
		});
	}


	/**
	 * Getter: ENV Credentials.
	 * @returns {Object}
	 */
	get envCredentials() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		}
	}
}

module.exports = MySQL;