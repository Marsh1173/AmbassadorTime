import Sqlite3, { Database } from "better-sqlite3";
import { Logger } from "../../logging/Logger";

export class DB {
  public static init(): Database {
    let db = new Sqlite3("src/server/database/utils/database.db", {
      fileMustExist: true,
      verbose: Logger.log_db,
    });
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = 1");
    db.pragma("foreign_keys = ON");
    return db;
  }
}
