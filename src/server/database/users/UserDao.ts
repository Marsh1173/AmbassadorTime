import BetterSqlite3 from "better-sqlite3";
import { HashAndSalt, PasswordService } from "./utils/PasswordService";
import { DAO } from "../utils/Dao";
import { BoolReturnMsg, FailureMsg, Success } from "../../utils/ReturnMsg";
import { ReturnMsg } from "../../utils/ReturnMsg";
import {
  UserData,
  UserModel,
  UserId,
  UserPerms,
} from "../../../model/db/UserModel";
import { ValidateDisplayName } from "./utils/ValidateDisplayName";
import { ValidateUserId } from "./utils/ValidateUserId";
import {
  ValidateLoginReturnMsg,
  ValidateLoginSuccess,
} from "../../authentication/utils/ClientValidator";

export const userid_taken_string: string = "User id already taken";

export const create_user_table_string = (table_name: string) => {
  return `CREATE TABLE '${table_name}' (\
    'id' VARCHAR(30) PRIMARY KEY NOT NULL,\
    'displayname' VARCHAR(30) NOT NULL,\
    'password' VARCHAR(32) NOT NULL,\
    'salt' VARCHAR(32) NOT NULL,\
    'perms' VARCHAR(32) NOT NULL,\
    CHECK (perms='${UserPerms.Logger}' OR perms='${UserPerms.Admin}')\
    );`;
};

export interface FetchUsersSuccess extends Success {
  users: UserData[];
}

export interface IUserDao {
  register_user(
    data: Pick<UserModel, "id" | "displayname" | "perms">
  ): ReturnMsg;
  validate_login(
    data: Pick<UserModel, "id" | "password">
  ): ValidateLoginReturnMsg;
  is_admin(user_id: UserId): BoolReturnMsg;
  is_logger(user_id: UserId): BoolReturnMsg;
  fetch_users_list(): FetchUsersSuccess | FailureMsg;
  change_user_password(new_password: string, user_id: UserId): ReturnMsg;
  delete_user(user_id: UserId): ReturnMsg;
}

export class UserDao extends DAO implements IUserDao {
  private readonly get_all_users_statement: BetterSqlite3.Statement<any[]>;
  private readonly insert_user: BetterSqlite3.Statement<any[]>;
  private readonly get_user: BetterSqlite3.Statement<any[]>;
  private readonly update_password: BetterSqlite3.Statement<any[]>;
  private readonly delete_user_statement: BetterSqlite3.Statement<any[]>;

  constructor(
    private readonly db: BetterSqlite3.Database,
    private readonly table_name: string = "users"
  ) {
    super();

    this.get_all_users_statement = this.db.prepare(
      `SELECT id, displayname, perms \
      FROM ${this.table_name};`
    );

    this.insert_user = this.db.prepare(
      `INSERT INTO ${this.table_name} (id, displayname, password, salt, perms) VALUES (?, ?, ?, ?, ?);`
    );

    this.get_user = this.db.prepare(
      `SELECT * FROM ${this.table_name} WHERE id = ?;`
    );

    this.update_password = this.db.prepare(
      `UPDATE ${this.table_name} SET password = ?, salt = ? WHERE id = ?`
    );

    this.delete_user_statement = this.db.prepare(
      `DELETE FROM ${this.table_name} WHERE id = ?`
    );
  }

  public register_user(
    data: Pick<UserModel, "id" | "displayname" | "perms">
  ): ReturnMsg {
    let validate_user_id_results: ReturnMsg = ValidateUserId.validate(data.id);
    if (!validate_user_id_results.success) {
      return validate_user_id_results;
    }
    let validate_display_name_results: ReturnMsg = ValidateDisplayName.validate(
      data.displayname
    );
    if (!validate_display_name_results.success) {
      return validate_display_name_results;
    }

    let hash_and_salt: HashAndSalt = PasswordService.hash_password(
      UserModel.InitialPassword
    );
    return this.catch_database_errors_run(() => {
      this.insert_user.run(
        data.id,
        data.displayname,
        hash_and_salt.hash,
        hash_and_salt.salt,
        data.perms
      );
      return { success: true };
    }, new Map([["SQLITE_CONSTRAINT_PRIMARYKEY", userid_taken_string]]));
  }

  public validate_login(
    data: Pick<UserModel, "password" | "id">
  ): ValidateLoginReturnMsg {
    return this.catch_database_errors_get<ValidateLoginSuccess>(() => {
      const failed_attempt: FailureMsg = {
        success: false,
        msg: "Incorrect username or password",
      };

      let user_model: UserModel | undefined = this.get_user.get(data.id);
      if (user_model === undefined) {
        return failed_attempt;
      }

      let valid_password: boolean = PasswordService.check_password(
        data.password,
        {
          hash: user_model.password,
          salt: user_model.salt,
        }
      );

      if (valid_password) {
        return {
          success: true,
          user_data: {
            id: user_model.id,
            displayname: user_model.displayname,
            perms: user_model.perms,
          },
        };
      } else {
        return failed_attempt;
      }
    });
  }

  public is_admin(user_id: UserId): BoolReturnMsg {
    return this.catch_database_errors_get<BoolReturnMsg>(() => {
      let user_model: UserModel | undefined = this.get_user.get(user_id);
      if (user_model === undefined) {
        return { success: false, msg: "User not found" };
      } else if (user_model.perms === UserPerms.Admin) {
        return { success: true, result: true };
      } else {
        return { success: true, result: false };
      }
    });
  }

  public is_logger(user_id: UserId): BoolReturnMsg {
    return this.catch_database_errors_get<BoolReturnMsg>(() => {
      let user_model: UserModel | undefined = this.get_user.get(user_id);
      if (user_model === undefined) {
        return { success: false, msg: "User not found" };
      } else if (user_model.perms === UserPerms.Logger) {
        return { success: true, result: true };
      } else {
        return { success: true, result: false };
      }
    });
  }

  public fetch_users_list(): FetchUsersSuccess | FailureMsg {
    return this.catch_database_errors_get<FetchUsersSuccess>(() => {
      return {
        success: true,
        users: this.get_all_users_statement.all(),
      };
    });
  }

  public change_user_password(
    new_password: string,
    user_id: UserId
  ): ReturnMsg {
    return this.catch_database_errors_run(() => {
      let user_model: UserModel | undefined = this.get_user.get(user_id);
      if (user_model === undefined) {
        return { success: false, msg: "User not found" };
      }

      let password_validation: ReturnMsg =
        PasswordService.validate_new_password(new_password);
      if (!password_validation.success) {
        return password_validation;
      }

      let hash_and_salt: HashAndSalt =
        PasswordService.hash_password(new_password);
      this.update_password.run(hash_and_salt.hash, hash_and_salt.salt, user_id);
      return { success: true };
    });
  }

  public delete_user(user_id: UserId): ReturnMsg {
    return this.catch_database_errors_run(() => {
      this.delete_user_statement.run(user_id);
      return { success: true };
    });
  }
}
