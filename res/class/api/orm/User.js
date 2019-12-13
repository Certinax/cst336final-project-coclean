"use strict";
require("dotenv").config();
// @ts-ignore
var mysql = require("../../mysql/MySQL");
// @ts-ignore
var mysqlCredentials = require("../../mysql/MysqlCredentials");
// @ts-ignore
var db = mysql.getInstance(new mysqlCredentials(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME));
/**
 * User
 * @author Isak Hauge
 */
var User = /** @class */ (function () {
    function User() {
    }
    // * Get specific user
    User.fetch = function (id, callback) {
        // Define SQL query.
        var sql = "SELECT * FROM User WHERE `ID` = ?;";
        // Execute query.
        db.prep(sql, [id])
            .then(function (resolved) {
            // ? If the resolved value is an array.
            if (Array.isArray(resolved)) {
                // ? If the query returned any results.
                if (resolved.length > 0) {
                    callback(resolved);
                }
                else {
                    console.error("MySQL: User with email (" + id + ") does not exist.");
                    callback([]);
                }
            }
            else
                callback([]);
        })
            .catch(function (err) {
            callback([]);
        });
    };
    // * Get all users
    User.fetchAll = function (callback) {
        var sql = "SELECT * FROM User;";
        db.query(sql)
            .then(function (resolved) {
            if (typeof resolved === "object")
                callback(resolved);
        })
            .catch(function (err) {
            callback([]);
        });
    };
    // *  Create user
    User.create = function (name, surname, email, password, callback) {
        password = mysql.SHA256(password);
        var sql = "CALL new_user(\"" + name + "\",\"" + surname + "\",\"" + email + "\",\"" + password + "\",@out,@out2); SELECT @out,@out2;";
        db.query(sql)
            .then(function (res) {
            callback(res);
        })
            .catch(function (err) {
            callback([]);
        });
    };
    // * Edit user
    User.edit = function (id, name, surname, email, oldPassword, newPassword, callback) {
        oldPassword = mysql.SHA256(oldPassword);
        newPassword = mysql.SHA256(newPassword);
        var sql = "CALL edit_user(\"" + id + "\", \"" + name + "\",\"" + surname + "\",\"" + email + "\",\"" + oldPassword + "\",\"" + newPassword + "\",@out); SELECT @out;";
        db.query(sql)
            .then(function (res) {
            callback(res);
        })
            .catch(function (err) {
            callback([]);
        });
    };
    // * Delete user
    User.delete = function (id, password, callback) {
        password = mysql.SHA256(password);
        var sql = "CALL delete_user(" + id + ",\"" + password + "\",@out); SELECT @out;";
        db.query(sql)
            .then(function (res) {
            callback(res);
        })
            .catch(function (err) {
            callback([]);
        });
    };
    // * User login
    User.login = function (email, password, callback) {
        var sql = "SELECT * FROM `User` WHERE `email` = ?;";
        db.prep(sql, [email])
            .then(function (resolved) {
            callback(resolved);
        })
            .catch(function (error) {
            callback(error);
        });
    };
    // * User is in collective.
    User.isInCollective = function (id, callback) {
        var sql = "SELECT COUNT(*) AS `in_collective` FROM `user_in_collective` WHERE `user_ID` = ?;";
        db.prep(sql, [id])
            .then(function (resolved) {
            callback(resolved);
        })
            .catch(function (error) {
            callback(error);
        });
    };
    // * User join collective
    User.joinCollective = function (id, key, callback) {
        var sql = "CALL add_user_coll(" + id + ", \"" + key + "\", @out, @out2); SELECT @out, @out2;";
        db.query(sql)
            .then(function (resolved) {
            callback(resolved);
        })
            .catch(function (err) {
            callback(err);
        });
    };
    // * User leave collective
    User.leaveCollective = function (id, collectiveId, callback) {
        var sql = "CALL delete_user_coll(" + id + ", " + collectiveId + ", @out); SELECT @out;";
        db.query(sql)
            .then(function (resolved) {
            callback(resolved);
        })
            .catch(function (err) {
            callback(err);
        });
    };
    // * Get users collective.
    User.getCollective = function (id, callback) {
        var sql = "SELECT" +
            " C.*" +
            " FROM" +
            " `Collective` AS C," +
            " `user_in_collective` AS UIC," +
            " `User` AS U" +
            " WHERE" +
            " C.`ID` = UIC.`collective_ID`" +
            " AND UIC.`user_ID` = U.`ID`" +
            " AND U.`ID` = ?;";
        db.prep(sql, [id])
            .then(function (resolved) {
            callback(resolved);
        })
            .catch(function (error) {
            callback(error);
        });
    };
    return User;
}());
module.exports = User;
