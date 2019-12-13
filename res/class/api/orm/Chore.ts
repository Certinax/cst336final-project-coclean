require("dotenv").config();
// @ts-ignore
const mysql = require("../../mysql/MySQL");
// @ts-ignore
const mysqlCredentials = require("../../mysql/MysqlCredentials");

// @ts-ignore
const db = mysql.getInstance(
  new mysqlCredentials(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_NAME
  )
);

class Chore {
  private static Table = {
    name: "Chore",
    column: {
      id: "ID",
      title: "title",
      description: "description",
      collectiveId: "collective_ID",
      status: "status",
      startDate: "start_date",
      frequency: "frequency"
    }
  };

  // * Get all Chores.
  public static fetchAll(callback: Function) {
    const sql = `SELECT * FROM \`${Chore.Table.name}\`;`;
    db.query(sql)
      .then((resolved: any) => {
        callback(resolved);
      })
      .catch((error: any) => {
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
  public static create(
    collectiveId: number,
    title: string,
    description: string,
    frequency: number,
    callback: Function
  ) {
    const sql = `CALL new_chore(${collectiveId}, "${title}", "${description}", ${frequency}, @out, @out2); SELECT @out, @out2;`;
    db.query(sql)
      .then((resolved: any) => {
        callback(resolved);
      })
      .catch((error: any) => {
        callback(error);
      });
  }

  // * Edit Chore
  public static edit(
    choreId: number,
    title: string,
    description: string,
    frequency: number,
    callback: Function
  ) {
    const sql = `CALL edit_chore(${choreId}, "${title}", "${description}", ${frequency}, @out); SELECT @out;`;
    db.query(sql)
      .then((resolved: any) => {
        callback(resolved);
      })
      .catch((error: any) => {
        callback(error);
      });
  }

  // * Delete Chore
  public static delete(collectiveId: number, callback: Function) {
    const sql = `CALL delete_chore(${collectiveId}, @out); SELECT @out`;
    db.query(sql)
      .then((resolved: any) => {
        callback(resolved);
      })
      .catch((error: any) => {
        callback(error);
      });
  }

  // * Increment chore.
  public static increment(choreId: number, callback: Function) {
    const sql = `CALL increment_chore(${choreId}, @out); SELECT @out;`;
    db.query(sql)
      .then((resolved: any) => {
        callback(resolved);
      })
      .catch((error: any) => {
        callback(error);
      });
  }
}

module.exports = Chore;
