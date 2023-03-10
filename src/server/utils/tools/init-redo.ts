import { UserPerms } from "../../../model/db/UserModel";
import { create_log_table_string } from "../../database/logs/LogDao";
import {
  create_user_table_string,
  UserDao,
} from "../../database/users/UserDao";
import { DB } from "../../database/utils/DB";

const users_table_name: string = "users";
const logs_table_name: string = "logs";

async function init() {
  let db = DB.init(false);

  try {
    db.prepare("drop table " + users_table_name + ";").run();
  } catch (er) {
    console.error(er);
  }
  try {
    db.prepare("drop table " + logs_table_name + ";").run();
  } catch (er) {
    console.error(er);
  }

  db.prepare(create_user_table_string(users_table_name)).run();
  db.prepare(create_log_table_string(logs_table_name, users_table_name)).run();

  let user_dao: UserDao = new UserDao(db, users_table_name);
  user_dao.register_user({
    id: "Admin",
    displayname: "Admin",
    perms: UserPerms.Admin,
  });

  user_dao.register_user({
    id: "TestLogger",
    displayname: "Test Logger",
    perms: UserPerms.Logger,
  });
}

init();
