require('dotenv').config();
// @ts-ignore
const mysql = require('../../mysql/MySQL');
// @ts-ignore
const mysqlCredentials = require('../../mysql/MysqlCredentials');
// @ts-ignore
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

	// * Get specific user
	public static fetch(id: number, callback: Function) {

		// Define SQL query.
		const sql = 'SELECT * FROM User WHERE `ID` = ?;';

		// Execute query.
		db.prep(sql, [id])
			.then((resolved: any) => {
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
			}).catch((err: any) => {
			callback([]);
		});
	}


	// * Get all users
	public static fetchAll(callback: Function) {
		const sql = 'SELECT * FROM User;';
		db.query(sql)
			.then((resolved: any) => {
				if (typeof resolved === 'object')
					callback(resolved);
			}).catch((err: any) => {
			callback([]);
		});
	}


	// *  Create user
	public static create(name: string, surname: string, email:string, password: string, callback: Function) {
		password = mysql.SHA256(password);
		const sql = `CALL new_user("${name}","${surname}","${email}","${password}",@out); SELECT @out;`;
		db.query(sql)
			.then((res: any) => {
				callback(res);
			}).catch((err: any) => {
			callback([]);
		});
	}


	// * Edit user
	public static edit(id: number, name: string, surname: string, email: string, oldPassword: string, newPassword: string, callback: Function) {
		oldPassword = mysql.SHA256(oldPassword);
		newPassword = mysql.SHA256(newPassword);
		const sql = `CALL edit_user("${id}", "${name}","${surname}","${email}","${oldPassword}","${newPassword}",@out); SELECT @out;`;
		db.query(sql)
			.then((res: any) => {
				callback(res);
			}).catch((err: any) => {
			callback([]);
		});
	}


	// * Delete user
	public static delete(id: number, password: string, callback: Function) {
		password = mysql.SHA256(password);
		const sql = `CALL delete_user(${id},"${password}",@out); SELECT @out;`;
		db.query(sql)
			.then((res: any) => {
				callback(res);
			}).catch((err: any) => {
			callback([]);
		});
	}


	// * User login
	public static login(email: string, password: string, callback: Function) {
		const sql = 'SELECT * FROM `User` WHERE `email` = ?;';
		const sql2 = 'SELECT COUNT(*) FROM `user_in_collective` WHERE `user_ID` = ?';
		db.prep(sql, [email]).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		})
	}


	// * User is in collective.
	public static isInCollective(id: number, callback: Function) {
		const sql = 'SELECT COUNT(*) AS `in_collective` FROM `user_in_collective` WHERE `user_ID` = ?;';
		db.prep(sql, [id]).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}


	// * User join collective
	public static joinCollective(id: string, key: string, callback: Function) {
		const sql = `CALL add_user_coll(${id}, "${key}", @out); SELECT @out;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((err: any) => {
			callback(err)
		});
	}


	// * User leave collective
	public static leaveCollective(id: string, collectiveId: string, callback: Function) {
		const sql = `CALL delete_user_coll(${id}, ${collectiveId}, @out); SELECT @out;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((err: any) => {
			callback(err)
		});
	}


	// * Get users collective.
	public static getCollective(id: number, callback: Function) {
		const sql = 'SELECT' +
			' C.*' +
			' FROM' +
			' `Collective` AS C,' +
			' `user_in_collective` AS UIC,' +
			' `User` AS U' +
			' WHERE' +
			' C.`ID` = UIC.`collective_ID`' +
			' AND UIC.`user_ID` = U.`ID`' +
			' AND U.`ID` = ?;';
		db.prep(sql, [id]).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}
}

module.exports = User;