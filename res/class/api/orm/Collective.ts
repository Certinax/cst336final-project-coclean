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

class Collective {
	private static Table = {
		name: 'Collective',
		column: {
			id: 'ID',
			name: 'name',
			key: 'key',
			adminUser: 'admin_user',
			onDutyUser: 'onduty_user'
		}
	};

	// * Get all Collectives.
	public static fetchAll(callback: Function) {
		const sql = `SELECT * FROM \`${Collective.Table.name}\`;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}

	// * Get specific Collective.
	public static fetch(id: number, callback: Function) {
		const sql = `SELECT * FROM \`${Collective.Table.name}\` WHERE \`${Collective.Table.column.id}\` = ?;`;
		db.prep(sql, [id]).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}

	// * Create collective
	public static create(name: string, description: string, school: string, userId: number, callback: Function) {
		const sql = `CALL new_collective(${name}, "${description}", "${school}", "${userId}", @out); SELECT @out;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}


	// * Edit Collective
	public static edit(id: number, name: string, description: string, school: string, callback: Function) {
		const sql = `CALL edit_collective(${id}, "${name}", "${description}", "${school}", @out); SELECT @out`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}


	// * Delete Collective
	public static delete(id: number, callback: Function) {
		const sql = `CALL delete_collective(${id}, @out); SELECT @out`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}
}

module.exports = Collective;