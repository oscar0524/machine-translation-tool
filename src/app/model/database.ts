import { SqliteService } from "../services/sqlite.service";

export class Database {
    protected static sql: SqliteService = new SqliteService()
}