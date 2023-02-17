import Sqlite3, { Database } from "better-sqlite3";
import { assert } from "../../../test/assert";
import { ReturnMsg } from "../utils/Dao";
import {
  create_user_table_string,
  IUserDao,
  UserDao,
  userid_taken_string,
} from "./UserDao";
import { UserData } from "./UserModel";

const test_users_table_name: string = "test_users";

const user_datas: UserData[] = [
  {
    id: "Naters",
    displayname: "Nate",
    is_logger: 1,
    is_admin: 0,
  },
  {
    id: "Marshers",
    displayname: "Marsh",
    is_logger: 1,
    is_admin: 0,
  },
  {
    id: "nonlogger",
    displayname: "NonLogger",
    is_logger: 0,
    is_admin: 1,
  },
];

export const test_user_database = async () => {
  //setup
  let db = await new Sqlite3("src/server/database/utils/database.db");
  attempt_drop_table(test_users_table_name, db);
  create_table(test_users_table_name, db);

  let user_dao: IUserDao = new UserDao(db, test_users_table_name);

  register_users(user_dao);
  get_logger_list(user_dao);
  validate_login(user_dao);
  promote_logger(user_dao);
  demote_admin_logger(user_dao);
  change_password(user_dao);
  delete_users(user_dao);

  // attempt_drop_table(test_users_table_name, db);
};

const attempt_drop_table = (name: string, db: Database) => {
  try {
    db.prepare("drop table test_users").run();
  } catch {}
};

const create_table = (name: string, db: Database) => {
  db.prepare(create_user_table_string(test_users_table_name)).run();
};

const register_users = (user_dao: IUserDao) => {
  let register_results: ReturnMsg = user_dao.register_logger({
    id: "Naters",
    displayname: "Nate",
  });
  assert(
    register_results.success,
    `register_users true`,
    `${register_results.success} should equal true`
  );

  register_results = user_dao.register_logger({
    id: "Marshers",
    displayname: "Marsh",
  });
  assert(
    register_results.success,
    `register_users second user true`,
    `${register_results.success} should equal true`
  );

  register_results = user_dao.register_logger({
    id: "Marshers",
    displayname: "MarshyTwo",
  });
  assert(
    !register_results.success,
    `register_users duplicate user false`,
    `${register_results.success} should equal false`
  );
  if (!register_results.success) {
    assert(
      register_results.msg === userid_taken_string,
      `register_users duplicate user false - correct message`,
      `${register_results.msg} should equal ${userid_taken_string}`
    );
  }

  register_results = user_dao.register_logger({
    id: "",
    displayname: "Username",
  });
  assert(
    !register_results.success,
    `register_users empty user id`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: " ",
    displayname: "Username",
  });
  assert(
    !register_results.success,
    `register_users bad user id space`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: "-",
    displayname: "Username",
  });
  assert(
    !register_results.success,
    `register_users bad user id dash`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: ".",
    displayname: "Username",
  });
  assert(
    !register_results.success,
    `register_users bad user id period`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: "abcd1000",
    displayname: "bad username1",
  });
  assert(
    !register_results.success,
    `register_users bad username number`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: "abcd1000",
    displayname: "bad username.",
  });
  assert(
    !register_results.success,
    `register_users bad username period`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: "abc",
    displayname: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  });
  assert(
    !register_results.success,
    `register_users username too long`,
    `${register_results.success} should equal false`
  );

  register_results = user_dao.register_logger({
    id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    displayname: "Display Name",
  });
  assert(
    !register_results.success,
    `register_users display name too long`,
    `${register_results.success} should equal false`
  );
};

const get_logger_list = (user_dao: IUserDao) => {
  let expected_logger_list: string = JSON.stringify([
    user_datas[0],
    user_datas[1],
  ]);
  let logger_list: string = JSON.stringify(user_dao.get_logger_list());
  assert(
    logger_list === expected_logger_list,
    `get_logger_list`,
    `${expected_logger_list} should equal ${logger_list}`
  );
};

const validate_login = (user_dao: IUserDao) => {
  let validation_results = user_dao.validate_login({
    id: "Naters",
    password: "password",
  });
  assert(
    validation_results.success,
    "validate_login true",
    `${validation_results.success} should be true`
  );
  assert(
    validation_results.success &&
      JSON.stringify(user_datas[0]) ===
        JSON.stringify(validation_results.user_data),
    "validate_login correct user data",
    `User data should be ${JSON.stringify(user_datas[0])}`
  );

  validation_results = user_dao.validate_login({
    id: "Naters",
    password: "abcd",
  });
  assert(
    !validation_results.success,
    "validate_login incorrect password",
    `${validation_results.success} should be false`
  );

  validation_results = user_dao.validate_login({
    id: "naters",
    password: "password",
  });
  assert(
    !validation_results.success,
    "validate_login non-existent user",
    `${validation_results.success} should be false`
  );

  validation_results = user_dao.validate_login({
    id: `Naters; drop table ${test_users_table_name};`,
    password: "password",
  });
  assert(
    !validation_results.success,
    "validate_login dangerous input",
    `${validation_results.success} should be false`
  );
};

const promote_logger = (user_dao: IUserDao) => {
  let promotion_results: ReturnMsg = user_dao.promote_logger("Naters");
  assert(
    promotion_results.success,
    "promote_logger true",
    `${promotion_results.success} should be true.`
  );

  let is_admin_results: ReturnMsg = user_dao.is_admin("Naters");
  assert(
    is_admin_results.success,
    "is_admin true",
    `${is_admin_results.success} should be true.`
  );

  promotion_results = user_dao.promote_logger("non-existent-user");
  assert(
    !promotion_results.success,
    "promote_logger non-existent user",
    `${promotion_results.success} should be false.`
  );

  promotion_results = user_dao.promote_logger("nonlogger");
  assert(
    !promotion_results.success,
    "promote_logger non-logger user",
    `${promotion_results.success} should be false.`
  );
};

const demote_admin_logger = (user_dao: IUserDao) => {
  let demotion_results: ReturnMsg = user_dao.demote_admin_logger("Naters");
  assert(
    demotion_results.success,
    "demote_admin_logger true",
    `${demotion_results.success} should be true.`
  );

  let isnt_admin_results: ReturnMsg = user_dao.is_admin("Naters");
  assert(
    !isnt_admin_results.success,
    "is_admin false",
    `${isnt_admin_results.success} should be false.`
  );

  demotion_results = user_dao.demote_admin_logger("Naters");
  assert(
    !demotion_results.success,
    "demote_admin_logger non-admin user",
    `${demotion_results.success} should be false.`
  );

  demotion_results = user_dao.demote_admin_logger("nonlogger");
  assert(
    !demotion_results.success,
    "demote_admin_logger non-logger user",
    `${demotion_results.success} should be false.`
  );

  demotion_results = user_dao.demote_admin_logger("non-existent-user");
  assert(
    !demotion_results.success,
    "demote_admin_logger non-existent user",
    `${demotion_results.success} should be false.`
  );
};

const change_password = (user_dao: IUserDao) => {
  let change_password_results: ReturnMsg = user_dao.change_user_password(
    "newpassword",
    "Naters"
  );
  assert(
    change_password_results.success,
    "change_password true",
    `${change_password_results.success} should be true.`
  );

  change_password_results = user_dao.change_user_password("", "Naters");
  assert(
    !change_password_results.success,
    "change_password bad password empty",
    `${change_password_results.success} should be false.`
  );

  change_password_results = user_dao.change_user_password(" ", "Naters");
  assert(
    !change_password_results.success,
    "change_password bad password space",
    `${change_password_results.success} should be false.`
  );

  change_password_results = user_dao.change_user_password(
    "newpassword",
    "naters"
  );
  assert(
    !change_password_results.success,
    "change_password non-existent user",
    `${change_password_results.success} should be false.`
  );

  let validation_results = user_dao.validate_login({
    id: "Naters",
    password: "newpassword",
  });
  assert(
    validation_results.success,
    "change_password user can use new password",
    `${validation_results.success} should be true`
  );
};

const delete_users = (user_dao: IUserDao) => {
  let delete_results: ReturnMsg = user_dao.delete_user("Naters");
  assert(
    delete_results.success,
    "delete_users true",
    `${delete_results.success} should be true`
  );

  let validation_results = user_dao.validate_login({
    id: "Naters",
    password: "newpassword",
  });
  assert(
    !validation_results.success,
    "delete_users user should be deleted",
    `${validation_results.success} should be false`
  );
};
