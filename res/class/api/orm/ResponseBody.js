"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var responseMeta = require('./ResponseMeta');
var ResponseBody = /** @class */ (function () {
    function ResponseBody(entity, operation, condition, successMessage, errorMessage, result) {
        var message = (condition) ? successMessage : errorMessage;
        this.meta = new responseMeta(entity, operation, condition, message);
        this.result = result;
    }
    return ResponseBody;
}());
exports.ResponseBody = ResponseBody;
module.exports = ResponseBody;
