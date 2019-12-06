"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql2 = require('mysql2');
var crypto = require('crypto');
require('dotenv').config();
/**
 * MySQL
 * This implementation of MySQL (mysql2) uses pool connections
 * for increased performance and reduced query latency.
 * @author Isak Hauge
 * @version 2.0
 */
var MySQL = /** @class */ (function () {
    /**
     * Constructor
     */
    function MySQL(login) {
        var _this = this;
        MySQL.makeConnectionPool(MySQL.config(login), function (pool) {
            _this.pool = pool;
        });
        this.id = crypto
            .createHash('md5')
            .update(Date.now().toString())
            .digest('base64');
    }
    /**
     * Make Connection Pool
     * @param config
     * @param callback
     */
    MySQL.makeConnectionPool = function (config, callback) {
        callback(mysql2.createPool(config));
    };
    /**
     * Get Instance (Singleton)
     */
    MySQL.getInstance = function (login) {
        if (MySQL.instance instanceof MySQL) {
            MySQL.cout("Using existing instance (" + MySQL.instance.getId() + ")");
            return MySQL.instance;
        }
        else {
            MySQL.instance = new MySQL(login);
            MySQL.cout("New instance (" + MySQL.instance.getId() + ")");
            return MySQL.instance;
        }
    };
    /**
     * Get ID
     */
    MySQL.prototype.getId = function () {
        return this.id;
    };
    /**
     * Query
     * @param sql
     */
    MySQL.prototype.query = function (sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.query(sql, function (err, result) {
                if (err)
                    resolve(err);
                else
                    resolve(result);
            });
        }).catch(function (promiseError) {
            MySQL.error(promiseError);
        });
    };
    /**
     * Prepared Statement
     * @param sql
     * @param data
     */
    MySQL.prototype.prep = function (sql, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.execute(sql, data, function (err, result) {
                if (err)
                    resolve(err);
                else
                    resolve(result);
            });
        }).catch(function (promiseError) {
            MySQL.error(promiseError);
        });
    };
    /**
     * SHA256
     * @param value
     * @constructor
     */
    MySQL.SHA256 = function (value) {
        return crypto.createHash('sha256').update(value).digest('base64');
    };
    /**
     * Config
     */
    MySQL.config = function (login) {
        var config = {
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
    };
    /**
     * Console Out
     * @param message
     */
    MySQL.cout = function (message) {
        var reset = '\x1b[0m';
        var primary = '\x1b[35m';
        var secondary = '\x1b[36m';
        console.log(primary + 'MySQL: ' + secondary + '%s' + reset, message);
    };
    /**
     * Error message
     * @param message
     */
    MySQL.error = function (message) {
        var reset = '\x1b[0m';
        var primary = '\x1b[35m';
        var secondary = '\x1b[31m';
        console.log(primary + 'MySQL: ' + secondary + '%s' + reset, message);
    };
    return MySQL;
}());
module.exports = MySQL;
