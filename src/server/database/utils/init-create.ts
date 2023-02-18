import Sqlite3 from "better-sqlite3";
import { DBBoolean } from "../../../model/db/DBBoolean";
import { Logger } from "../../logging/Logger";
import { create_log_table_string } from "../logs/LogDao";
import { create_user_table_string, UserDao } from "../users/UserDao";

const users_table_name: string = "users";
const logs_table_name: string = "logs";

async function init() {
  let db = await new Sqlite3("src/server/database/utils/database.db", {
    verbose: Logger.log_db,
  });
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = 1");
  db.pragma("foreign_keys = ON");

  try {
    db.prepare("drop table " + users_table_name).run();
    db.prepare("drop table " + logs_table_name).run();
  } catch (er) {}

  db.prepare(create_user_table_string(users_table_name)).run();
  db.prepare(create_log_table_string(logs_table_name, users_table_name)).run();

  let user_dao: UserDao = new UserDao(db, users_table_name);
  user_dao.register_user({
    id: "Admin",
    displayname: "Admin",
    is_admin: DBBoolean.True,
    is_logger: DBBoolean.False,
  });
  user_dao.change_user_password("admin", "Admin");

  user_dao.register_user({
    id: "TestAdminLogger",
    displayname: "Test Admin Logger",
    is_admin: DBBoolean.True,
    is_logger: DBBoolean.True,
  });
  user_dao.register_user({
    id: "TestLogger",
    displayname: "Test Logger",
    is_admin: DBBoolean.False,
    is_logger: DBBoolean.True,
  });
}

init();
