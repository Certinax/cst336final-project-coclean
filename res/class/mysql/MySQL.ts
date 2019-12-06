const mysql2 = require('mysql2');
const crypto = require('crypto');
import {MysqlCredentials} from './MysqlCredentials';
require('dotenv').config();

/**
 * MySQL
 * This implementation of MySQL (mysql2) uses pool connections
 * for increased performance and reduced query latency.
 * @author Isak Hauge
 * @version 2.0
 */
class MySQL {

	/**
	 * Instance variable.
	 */
	private pool : Object | any;
	private readonly id : string;

	/**
	 * Static variables.
	 */
	private static instance: MySQL | any;

	/**
	 * Make Connection Pool
	 * @param config
	 * @param callback
	 */
	private static makeConnectionPool (config: ConnectionConfig, callback : Function) : void {
		callback(mysql2.createPool(config));
	}

	/**
	 * Constructor
	 */
	private constructor(login: MysqlCredentials) {
		MySQL.makeConnectionPool(MySQL.config(login), (pool : Object) => {
			this.pool = pool;
		});
		this.id = crypto
			.createHash('md5')
			.update(Date.now().toString())
			.digest('base64');
	}

	/**
	 * Get Instance (Singleton)
	 */
	public static getInstance(login: MysqlCredentials): MySQL {
		if (MySQL.instance instanceof MySQL) {
			MySQL.cout(`Using existing instance (${MySQL.instance.getId()})`);
			return MySQL.instance;
		} else {
			MySQL.instance = new MySQL(login);
			MySQL.cout(`New instance (${MySQL.instance.getId()})`);
			return MySQL.instance;
		}
	}

	/**
	 * Get ID
	 */
	public getId() : string{
		return this.id;
	}

	/**
	 * Query
	 * @param sql
	 */
	public query(sql: string) : Promise<any> {
		return new Promise((resolve, reject) => {
			this.pool.query(sql, (err: any, result: any) => {
				if (err) resolve(err);
				else resolve(result);
			});
		}).catch((promiseError) => {
			MySQL.error(promiseError);
		});
	}

	/**
	 * Prepared Statement
	 * @param sql
	 * @param data
	 */
	public prep(sql : string, data : Array<any>) : Promise<any> {
		return new Promise((resolve, reject) => {
			this.pool.execute(sql, data, (err : any, result : any) => {
				if (err) resolve(err);
				else resolve(result);
			});
		}).catch((promiseError) => {
			MySQL.error(promiseError);
		});
	}

	/**
	 * SHA256
	 * @param value
	 * @constructor
	 */
	public static SHA256(value: string): string {
		return crypto.createHash('sha256').update(value).digest('base64');
	}

	/**
	 * Config
	 */
	private static config(login: MysqlCredentials) : ConnectionConfig {
		const config : ConnectionConfig = {
			host: login.host,
			user: login.user,
			password: login.password,
			multipleStatements: true,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		};

		if (login.schema)
			config.database = login.schema;

		return config;
	}

	/**
	 * Console Out
	 * @param message
	 */
	private static cout(message: string) : void {
		const reset = '\x1b[0m';
		const primary = '\x1b[35m';
		const secondary = '\x1b[36m';
		console.log(
			primary + 'MySQL: ' + secondary + '%s' + reset,
			message,
		);
	}

	/**
	 * Error message
	 * @param message
	 */
	private static error(message: string) : void {
		const reset = '\x1b[0m';
		const primary = '\x1b[35m';
		const secondary = '\x1b[31m';
		console.log(
			primary + 'MySQL: ' + secondary + '%s' + reset,
			message,
		);
	}
}


interface ConnectionConfig {
	// MySQL login credentials:
	host: string,
	user: string,
	password: string,
	// Optional default schema.
	database?: string,
	// Other configurations:
	multipleStatements: boolean,
	waitForConnections: boolean,
	connectionLimit: number,
	queueLimit: number
}

module.exports = MySQL;