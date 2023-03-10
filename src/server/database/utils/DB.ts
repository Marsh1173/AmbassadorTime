import Sqlite3, { Database } from "better-sqlite3";
import { Logger } from "../../logging/Logger";

export class DB {
  public static init(
    fileMustExist: boolean = true,
    verbose:
      | ((message?: any, ...additionalArgs: any[]) => void)
      | undefined = Logger.log_db
  ): Database {
    let db = new Sqlite3("src/server/database/utils/database.db", {
      fileMustExist,
      verbose,
    });
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = 1");
    db.pragma("foreign_keys = ON");
    return db;
  }
}
