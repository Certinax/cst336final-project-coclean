abstract class OrmEntity {

	private _id : Number | undefined;
	private _tableName : String | undefined;

	public getId() : Number | undefined {
		return this._id;
	}

	public setId(id: Number): OrmEntity {
		this._id = id;
		return this;
	}

	public getTableName() : String | undefined {
		return this._tableName;
	}

	public setTableName(tableName: String): OrmEntity {
		this._tableName = tableName;
		return this;
	}
}

module.exports = OrmEntity;