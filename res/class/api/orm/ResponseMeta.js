"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseMeta = /** @class */ (function () {
    function ResponseMeta(entity, operation, success, text) {
        this.entity = entity;
        this.operation = operation;
        this.success = success;
        this.text = text;
    }
    return ResponseMeta;
}());
exports.ResponseMeta = ResponseMeta;
module.exports = ResponseMeta;
