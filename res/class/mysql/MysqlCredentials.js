"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MysqlCredentials = /** @class */ (function () {
    function MysqlCredentials(host, user, password, schema) {
        this._host = host;
        this._user = user;
        this._password = password;
        this._schema = schema;
    }
    Object.defineProperty(MysqlCredentials.prototype, "host", {
        get: function () {
            return this._host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MysqlCredentials.prototype, "user", {
        get: function () {
            return this._user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MysqlCredentials.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MysqlCredentials.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    return MysqlCredentials;
}());
exports.MysqlCredentials = MysqlCredentials;
module.exports = MysqlCredentials;
