import { create_log_table_string } from "../../../database/logs/LogDao";
import { DB } from "../../../database/utils/DB";

const users_table_name: string = "users";
const logs_table_name: string = "logs";

async function init() {
  let db = DB.init(false);

  try {
    db.prepare("drop table " + logs_table_name + ";").run();
  } catch (er) {
    console.error(er);
  }

  db.prepare(create_log_table_string(logs_table_name, users_table_name)).run();
}

init();
