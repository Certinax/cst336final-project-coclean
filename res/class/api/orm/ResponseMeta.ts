import {CrudOperation} from "./CrudOperation";

export class ResponseMeta implements ResponseMetaInterface{
	public entity: string;
	public operation: CrudOperation;
	public success: boolean;
	public text: string;

	constructor(entity: string, operation: CrudOperation, success: boolean, text: string) {
		this.entity = entity;
		this.operation = operation;
		this.success = success;
		this.text = text;
	}
}

export interface ResponseMetaInterface {
	entity: string,
	operation: CrudOperation,
	success: boolean,
	text: string,
}

module.exports = ResponseMeta;