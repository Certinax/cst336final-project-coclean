"use strict";
var OrmEntity = /** @class */ (function () {
    function OrmEntity() {
    }
    OrmEntity.prototype.getId = function () {
        return this._id;
    };
    OrmEntity.prototype.setId = function (id) {
        this._id = id;
        return this;
    };
    OrmEntity.prototype.getTableName = function () {
        return this._tableName;
    };
    OrmEntity.prototype.setTableName = function (tableName) {
        this._tableName = tableName;
        return this;
    };
    return OrmEntity;
}());
module.exports = OrmEntity;
