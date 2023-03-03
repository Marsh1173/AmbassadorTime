import Sqlite3, { Database } from "better-sqlite3";
import { assert, CouldNotContinueError } from "../../../test/assert";
import {
  create_user_table_string,
  FetchUsersSuccess,
  IUserDao,
  UserDao,
  userid_taken_string,
} from "./UserDao";
import { UserData, UserPerms } from "../../../model/db/UserModel";
import { FailureMsg, ReturnMsg } from "../../utils/ReturnMsg";
import { PasswordService } from "./utils/PasswordService";

const test_users_table_name: string = "test_users";

const user_datas: UserData[] = [
  {
    id: "Naters",
    displayname: "Nate",
    perms: UserPerms.Logger,
  },
  {
    id: "Marshers",
    displayname: "Marsh",
    perms: UserPerms.Logger,
  },
  {
    id: "admin",
    displayname: "Admin",
    perms: UserPerms.Admin,
  },
];

export const test_user_database = async () => {
  //setup
  let db = await new Sqlite3("src/server/database/utils/database.db");
  attempt_drop_table(test_users_table_name, db);
  create_table(test_users_table_name, db);

  let user_dao: IUserDao = new UserDao(db, test_users_table_name);

  register_users(user_dao);
  get_user_list(user_dao);
  validate_login(user_dao);
  change_password(user_dao);
  delete_users(user_dao);

  attempt_drop_table(test_users_table_name, db);
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
  for (const user_data of user_datas) {
    let register_results: ReturnMsg = user_dao.register_user(user_data);
    assert(
      register_results.success,
      `register_users true`,
      `${register_results.success} should equal true`
    );
  }

  let bad_register_results: ReturnMsg = user_dao.register_user({
    id: "Marshers",
    displayname: "MarshyTwo",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users duplicate user false`,
    `${bad_register_results.success} should equal false`
  );
  if (!bad_register_results.success) {
    assert(
      bad_register_results.msg === userid_taken_string,
      `register_users duplicate user false - correct message`,
      `${bad_register_results.msg} should equal ${userid_taken_string}`
    );
  }

  bad_register_results = user_dao.register_user({
    id: "",
    displayname: "Username",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users empty user id`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: " ",
    displayname: "Username",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users bad user id space`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: "-",
    displayname: "Username",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users bad user id dash`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: ".",
    displayname: "Username",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users bad user id period`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: "abcd1000",
    displayname: "bad username1",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users bad username number`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: "abcd1000",
    displayname: "bad username.",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users bad username period`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: "abc",
    displayname: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users username too long`,
    `${bad_register_results.success} should equal false`
  );

  bad_register_results = user_dao.register_user({
    id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    displayname: "Display Name",
    perms: UserPerms.Logger,
  });
  assert(
    !bad_register_results.success,
    `register_users display name too long`,
    `${bad_register_results.success} should equal false`
  );
};

const get_user_list = (user_dao: IUserDao) => {
  let expected_user_list: string = JSON.stringify(user_datas);
  let user_list: FailureMsg | FetchUsersSuccess = user_dao.fetch_users_list();
  if (!user_list.success) throw new CouldNotContinueError("Get user list");
  let results_json: string = JSON.stringify(user_list.users);
  assert(
    results_json === expected_user_list,
    `get_user_list`,
    `${expected_user_list} should equal ${results_json}`
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
    !change_password_results.success &&
      change_password_results.msg === PasswordService.errs.not_empty,
    "change_password bad password empty",
    `${
      change_password_results.success
    } should be false and message should say what's wrong (it says ${
      (change_password_results as FailureMsg).msg
    }).`
  );

  change_password_results = user_dao.change_user_password(" ", "Naters");
  assert(
    !change_password_results.success &&
      change_password_results.msg === PasswordService.errs.no_spaces,
    "change_password bad password space",
    `${
      change_password_results.success
    } should be false and message should say what's wrong (it says ${
      (change_password_results as FailureMsg).msg
    }).`
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
