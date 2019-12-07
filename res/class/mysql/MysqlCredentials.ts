export class MysqlCredentials {

	private readonly _host: string;
	private readonly _user: string;
	private readonly _password: string;
	private readonly _schema: string | undefined;

	constructor(host: string, user: string, password: string, schema?: string) {
		this._host = host;
		this._user = user;
		this._password = password;
		this._schema = schema;
	}

	get host(): string {
		return this._host;
	}

	get user(): string {
		return this._user;
	}

	get password(): string {
		return this._password;
	}

	get schema(): string | undefined {
		return this._schema;
	}
}

module.exports = MysqlCredentials;