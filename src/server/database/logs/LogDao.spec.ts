import Sqlite3, { Database } from "better-sqlite3";
import { LogId, LogModel } from "../../../model/db/LogModel";
import { UserModel, UserPerms } from "../../../model/db/UserModel";
import { assert, CouldNotContinueError } from "../../../test/assert";
import { FailureMsg, ReturnMsg } from "../../utils/ReturnMsg";
import { create_user_table_string, IUserDao, UserDao } from "../users/UserDao";
import {
  cannot_log_future_time,
  create_log_table_string,
  FetchLogsSuccess,
  ILogDao,
  LogDao,
  LogModelSuccess,
  LogSuccess,
  user_does_not_exist,
} from "./LogDao";

const test_users_table_name: string = "test_users";
const test_logs_table_name: string = "test_logs";

const test_logger_register_data: Pick<
  UserModel,
  "id" | "displayname" | "perms"
> = { id: "loggeruser", displayname: "Logger User", perms: UserPerms.Logger };
const test_admin_register_data: Pick<
  UserModel,
  "id" | "displayname" | "perms"
> = { id: "adminuser", displayname: "Admin User", perms: UserPerms.Admin };

const good_log_data: Pick<
  LogModel,
  "short_description" | "target_date_time_ms" | "minutes_logged"
> = {
  short_description: "Short desc",
  target_date_time_ms: 1,
  minutes_logged: 1,
};

export const test_log_database = async () => {
  //setup
  let db = await new Sqlite3("src/server/database/utils/database.db");
  attempt_drop_table(db);
  create_table(db);

  let user_dao: IUserDao = new UserDao(db, test_users_table_name);
  let log_dao: ILogDao = new LogDao(
    db,
    test_logs_table_name,
    test_users_table_name
  );

  for (const test of tests) {
    test(user_dao, log_dao);
  }

  attempt_drop_table(db);
};

const attempt_drop_table = (db: Database) => {
  try {
    db.prepare("drop table " + test_logs_table_name).run();
  } catch {}
  try {
    db.prepare("drop table " + test_users_table_name).run();
  } catch {}
};

const create_table = (db: Database) => {
  db.prepare(create_user_table_string(test_users_table_name)).run();
  db.prepare(
    create_log_table_string(test_logs_table_name, test_users_table_name)
  ).run();
};

const tests: ((user_dao: IUserDao, log_dao: ILogDao) => void)[] = [
  (user_dao: IUserDao, log_dao: ILogDao) => {
    assert(
      user_dao.register_user(test_admin_register_data).success === true,
      "initial admin user register",
      "Admin user should be able to be registered"
    );
    assert(
      user_dao.register_user(test_logger_register_data).success === true,
      "initial logger user register",
      "Logger user should be able to be registered"
    );
  },
  (user_dao: IUserDao, log_dao: ILogDao) => {
    let results: FailureMsg | LogModelSuccess = log_dao.create_log(
      good_log_data,
      test_logger_register_data
    );
    assert(
      results.success === true,
      "create log success",
      "success should be true"
    );
  },
  (user_dao: IUserDao, log_dao: ILogDao) => {
    let results: FailureMsg | LogModelSuccess = log_dao.create_log(
      good_log_data,
      { ...test_logger_register_data, id: "asdf" }
    );
    assert(
      results.success === false,
      "create log fail non-existing user",
      "success should be false"
    );
    assert(
      results.success === false && results.msg === user_does_not_exist,
      "create log fail non-existing user correct msg",
      "failure message should be descriptive"
    );

    results = log_dao.create_log(
      {
        ...good_log_data,
        target_date_time_ms: Date.now() + 10000,
      },
      test_logger_register_data
    );
    assert(
      results.success === false,
      "create log fail logging hours in the future",
      "success should be false"
    );
    assert(
      results.success === false && results.msg === cannot_log_future_time,
      "create log fail logging hours in the future correct msg",
      "failure message should be descriptive"
    );
  },
  (user_dao: IUserDao, log_dao: ILogDao) => {
    let results: FailureMsg | LogModelSuccess = log_dao.create_log(
      good_log_data,
      test_logger_register_data
    );
    if (!results.success)
      throw new CouldNotContinueError("Get user logs creation");

    let get_logs_results: FetchLogsSuccess | FailureMsg = log_dao.get_user_logs(
      test_logger_register_data.id
    );
    assert(
      get_logs_results.success,
      "get user logs success",
      `${get_logs_results.success} should be true`
    );

    if (!get_logs_results.success)
      throw new CouldNotContinueError("Get user logs");

    assert(
      get_logs_results.logs[0].user_id === test_logger_register_data.id &&
        get_logs_results.logs[0].displayname ===
          test_logger_register_data.displayname,
      "get user logs correct data",
      `${get_logs_results.logs[0].user_id} should be ${test_logger_register_data.id} \
      and ${get_logs_results.logs[0].displayname} should be ${test_logger_register_data.displayname}`
    );
  },
  (user_dao: IUserDao, log_dao: ILogDao) => {},
  (user_dao: IUserDao, log_dao: ILogDao) => {
    let results: FailureMsg | LogModelSuccess = log_dao.create_log(
      good_log_data,
      test_logger_register_data
    );
    if (!results.success)
      throw new CouldNotContinueError("Delete log creation");

    let delete_log_results: ReturnMsg = log_dao.delete_log(results.log.id);
    assert(
      delete_log_results.success === true,
      "delete log",
      `${delete_log_results.success} should be true`
    );
  },
];
