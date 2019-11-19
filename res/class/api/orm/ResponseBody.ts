import {ResponseMeta} from "./ResponseMeta";
import {CrudOperation} from "./CrudOperation";
const responseMeta = require('./ResponseMeta');

export class ResponseBody implements ResponseBodyInterface{
	public meta: ResponseMeta;
	public result: Object | Array<any>;

	constructor(entity: string, operation: CrudOperation, condition: boolean, successMessage: string, errorMessage: string, result: Object | Array<any>) {
		const message: string = (condition) ? successMessage : errorMessage;
		this.meta = new responseMeta(entity, operation, condition, message);
		this.result = result;
	}
}

export interface ResponseBodyInterface {
	meta: ResponseMeta,
	result: Object | Array<any>
}

module.exports = ResponseBody;