import Sqlite3, { Database } from "better-sqlite3";
import { assert } from "../../../test/assert";
import { create_user_table_string, IUserDao, UserDao } from "../users/UserDao";
import { create_log_table_string } from "./LogDao";

const test_users_table_name: string = "test_users";
const test_logs_table_name: string = "test_logs";

export const test_log_database = async () => {
  //setup
  let db = await new Sqlite3("src/server/database/utils/database.db");
  attempt_drop_table(db);
  create_table(db);

  let user_dao: IUserDao = new UserDao(db, test_users_table_name);
  let log_dao: IUserDao = new UserDao(db, test_logs_table_name);

  for (const test of tests) {
    test(user_dao, log_dao);
  }

  //attempt_drop_table(db);
};
const attempt_drop_table = (db: Database) => {
  try {
    db.prepare("drop table " + test_logs_table_name).run();
    db.prepare("drop table " + test_users_table_name).run();
  } catch {}
};

const create_table = (db: Database) => {
  db.prepare(create_user_table_string(test_users_table_name)).run();
  db.prepare(
    create_log_table_string(test_logs_table_name, test_users_table_name)
  ).run();
};

const tests: ((user_dao: IUserDao, log_dao: IUserDao) => void)[] = [
  (user_dao: IUserDao, log_dao: IUserDao) => {},
];
