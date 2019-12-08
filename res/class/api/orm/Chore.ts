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

class Chore {
	private static Table = {
		name: 'Chore',
		column: {
			id: 'ID',
			title: 'title',
			description: 'description',
			collectiveId: 'collective_ID',
			status: 'status',
			startDate: 'start_date',
			frequency: 'frequency'
		}
	};

	// * Get all Chores.
	public static fetchAll(callback: Function) {
		const sql = `SELECT * FROM \`${Chore.Table.name}\`;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}

	// * Get specific Chore.
	public static fetch(id: number, callback: Function) {
		const sql = `SELECT * FROM \`${Chore.Table.name}\` WHERE \`${Chore.Table.column.id}\` = ?;`;
		db.prep(sql, [id]).then((resolved: any) => {
			callback(resolved);
		});
	}

	// * Create Chore
	public static create(collectionName: string, title: string, description: string, startDate: string, frequency: number, callback: Function) {
		const sql = `CALL new_chore("${collectionName}", "${title}", "${description}", DATE("${startDate}"), ${frequency}, @out); SELECT @out;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}


	// * Edit Chore
	public static edit(collectionName: string, title: string, description: string, frequency: number, callback: Function) {
		const sql = `CALL edit_chore("${collectionName}", "${title}", "${description}", ${frequency}, @out); SELECT @out;`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}


	// * Delete Chore
	public static delete(collectiveName: string, title: string, password: string, callback: Function) {
		const sql = `CALL delete_chore("${collectiveName}", "${title}", "${password}", @out); SELECT @out`;
		db.query(sql).then((resolved: any) => {
			callback(resolved);
		}).catch((error: any) => {
			callback(error);
		});
	}
}

module.exports = Chore;