"use strict";
require('dotenv').config();
// @ts-ignore
var mysql = require('../../mysql/MySQL');
// @ts-ignore
var mysqlCredentials = require('../../mysql/MysqlCredentials');
// @ts-ignore
var db = mysql.getInstance(new mysqlCredentials(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME));
var Collective = /** @class */ (function () {
    function Collective() {
    }
    // * Get all Collectives.
    Collective.fetchAll = function (callback) {
        var sql = "SELECT * FROM `" + Collective.Table.name + "`;";
        db.query(sql).then(function (resolved) {
            callback(resolved);
        }).catch(function (error) {
            callback(error);
        });
    };
    // * Get specific Collective.
    Collective.fetch = function (id, callback) {
        var sql = "SELECT * FROM `" + Collective.Table.name + "` WHERE `" + Collective.Table.column.id + "` = ?;";
        db.prep(sql, [id]).then(function (resolved) {
            callback(resolved);
        }).catch(function (error) {
            callback(error);
        });
    };
    // * Create collective
    Collective.create = function (name, description, school, userId, callback) {
        var sql = "CALL new_collective(\"" + name + "\", \"" + description + "\", \"" + school + "\", " + userId + ", @out); SELECT @out;";
        db.query(sql).then(function (resolved) {
            callback(resolved);
        }).catch(function (error) {
            callback(error);
        });
    };
    // * Edit Collective
    Collective.edit = function (id, name, description, school, callback) {
        var sql = "CALL edit_collective(" + id + ", \"" + name + "\", \"" + description + "\", \"" + school + "\", @out); SELECT @out";
        db.query(sql).then(function (resolved) {
            callback(resolved);
        }).catch(function (error) {
            callback(error);
        });
    };
    // * Delete Collective
    Collective.delete = function (id, callback) {
        var sql = "CALL delete_collective(" + id + ", @out); SELECT @out";
        db.query(sql).then(function (resolved) {
            callback(resolved);
        }).catch(function (error) {
            callback(error);
        });
    };
    // * Get collective's chores.
    Collective.getChores = function (collectiveId, callback) {
        var sql = 'SELECT * FROM `Chore` WHERE `collective_ID` = ?;';
        db.prep(sql, [collectiveId]).then(function (resolved) {
            callback(resolved);
        }).catch(function (error) {
            callback(error);
        });
    };
    Collective.Table = {
        name: 'Collective',
        column: {
            id: 'ID',
            name: 'name',
            key: 'key',
            adminUser: 'admin_user',
            onDutyUser: 'onduty_user'
        }
    };
    return Collective;
}());
module.exports = Collective;
