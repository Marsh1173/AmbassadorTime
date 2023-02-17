import Sqlite3 from "better-sqlite3";
import { Logger } from "../../logging/Logger";
import { create_user_table_string } from "../users/UserDao";

async function init() {
  let db = await new Sqlite3("src/server/database/utils/database.db", {
    verbose: Logger.log_db,
  });
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = 1");
  db.pragma("foreign_keys = ON");

  try {
    db.prepare("drop table users").run();
  } catch (er) {}

  db.prepare(create_user_table_string("users")).run();
}

init();
