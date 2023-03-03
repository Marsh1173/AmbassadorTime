import BetterSqlite3 from "better-sqlite3";
import { LogData, LogId, LogModel } from "../../../model/db/LogModel";
import { HasId, make_id } from "../../../model/utils/Id";
import { UserData, UserId } from "../../../model/db/UserModel";
import { ValidateLog } from "./utils/ValidateLog";
import { FailureMsg, ReturnMsg, Success } from "../../utils/ReturnMsg";
import { DAO } from "../utils/Dao";

export const user_does_not_exist: string = "User does not exist";
export const cannot_log_future_time: string = "Cannot log hours in the future";

export const create_log_table_string = (
  table_name: string,
  user_table_name: string
) => {
  return `CREATE TABLE '${table_name}' (\
    'id' VARCHAR(50) PRIMARY KEY NOT NULL,\
    'short_description' VARCHAR(30) NOT NULL,\
    'target_date_time_ms' INT NOT NULL,\
    'minutes_logged' INT NOT NULL,\
    'time_logged_ms' INT NOT NULL,\
    'user_id' BOOLEAN NOT NULL,\
    FOREIGN KEY (user_id) REFERENCES ${user_table_name} (id)\
    );`;
};

export interface ILogDao {
  create_log(
    data: Pick<
      LogModel,
      "short_description" | "target_date_time_ms" | "minutes_logged"
    >,
    user_data: UserData
  ): LogModelSuccess | FailureMsg;
  delete_log(id: LogId): ReturnMsg;
  edit_log(log_data: Partial<LogModel> & HasId): LogSuccess | FailureMsg;
  get_user_logs(user_id: UserId): FetchLogsSuccess | FailureMsg;
  get_all_logs(): FetchLogsSuccess | FailureMsg;
}

export interface LogModelSuccess extends Success {
  log: LogModel;
}

export interface LogSuccess extends Success {
  log: LogData;
}

export interface FetchLogsSuccess extends Success {
  logs: LogData[];
}

export class LogDao extends DAO implements ILogDao {
  private readonly insert_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly delete_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly edit_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_user_logs_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_all_logs_statement: BetterSqlite3.Statement<any[]>;

  constructor(
    private readonly db: BetterSqlite3.Database,
    private readonly table_name: string = "logs",
    private readonly users_table_name: string = "users"
  ) {
    super();

    this.insert_log_statement = this.db.prepare(
      `INSERT INTO ${this.table_name} (id, short_description, target_date_time_ms, minutes_logged, time_logged_ms, user_id) VALUES (?, ?, ?, ?, ?, ?);`
    );

    this.delete_log_statement = this.db.prepare(
      `DELETE FROM ${this.table_name} WHERE id = ?`
    );

    this.edit_log_statement = this.db.prepare(
      `UPDATE ${this.table_name} SET short_description = ?, target_date_time_ms = ?, minutes_logged = ?, time_logged_ms = ? WHERE id = ?`
    );

    this.get_log_statement = this.db.prepare(
      `SELECT ${this.table_name}.id, short_description, target_date_time_ms, minutes_logged, time_logged_ms, user_id, \
      ${this.users_table_name}.displayname AS displayname \
      FROM ${this.table_name} \
      LEFT JOIN ${this.users_table_name} \
      ON ${this.table_name}.user_id = ${this.users_table_name}.id \
      and ${this.table_name}.id = ?;`
    );

    this.get_user_logs_statement = this.db.prepare(
      `SELECT ${this.table_name}.id, short_description, target_date_time_ms, minutes_logged, time_logged_ms, user_id, \
      ${this.users_table_name}.displayname AS displayname \
      FROM ${this.table_name} \
      LEFT JOIN ${this.users_table_name} \
      ON ${this.table_name}.user_id = ${this.users_table_name}.id \
      and user_id = ? \
      ORDER BY target_date_time_ms DESC;`
    );

    this.get_all_logs_statement = this.db.prepare(
      `SELECT ${this.table_name}.id, short_description, target_date_time_ms, minutes_logged, time_logged_ms, user_id, \
      ${this.users_table_name}.displayname AS displayname \
      FROM ${this.table_name} \
      LEFT JOIN ${this.users_table_name} \
      ON ${this.table_name}.user_id = ${this.users_table_name}.id \
      ORDER BY target_date_time_ms DESC;`
    );
  }

  public create_log(
    data: Pick<
      LogModel,
      "short_description" | "target_date_time_ms" | "minutes_logged"
    >,
    user_data: UserData
  ): LogModelSuccess | FailureMsg {
    return this.catch_database_errors_get<LogModelSuccess>(() => {
      let now: number = Date.now();

      let validate_log_results: ReturnMsg = ValidateLog.validate_log(
        now,
        data.target_date_time_ms,
        user_data
      );
      if (!validate_log_results.success) {
        return validate_log_results;
      }

      let id: LogId = make_id();
      this.insert_log_statement.run(
        id,
        data.short_description,
        data.target_date_time_ms,
        data.minutes_logged,
        now.toString(),
        user_data.id
      );
      return {
        success: true,
        log: { ...data, id, time_logged_ms: now, user_id: user_data.id },
      };
    }, new Map([["SQLITE_CONSTRAINT_FOREIGNKEY", user_does_not_exist]]));
  }

  public delete_log(id: string): ReturnMsg {
    return this.catch_database_errors_run(() => {
      this.delete_log_statement.run(id);
      return { success: true };
    });
  }

  public edit_log(
    log_data: Partial<LogModel> & HasId
  ): LogSuccess | FailureMsg {
    return this.catch_database_errors_get<LogSuccess>(() => {
      let get_log_results: LogSuccess | FailureMsg = this.get_log(log_data.id);
      if (!get_log_results.success) {
        return get_log_results;
      }

      let log: LogData = { ...get_log_results.log, ...log_data };
      this.edit_log_statement.run(
        log.short_description,
        log.target_date_time_ms,
        log.minutes_logged,
        log.time_logged_ms
      );
      return { success: true, log };
    });
  }

  public get_user_logs(user_id: string): FailureMsg | FetchLogsSuccess {
    return this.catch_database_errors_get<FetchLogsSuccess>(() => {
      return { success: true, logs: this.get_user_logs_statement.all(user_id) };
    });
  }

  public get_all_logs(): FailureMsg | FetchLogsSuccess {
    return this.catch_database_errors_get<FetchLogsSuccess>(() => {
      return { success: true, logs: this.get_all_logs_statement.all() };
    });
  }

  public get_log(id: LogId): LogSuccess | FailureMsg {
    return this.catch_database_errors_get<LogSuccess>(() => {
      let log: LogData | undefined = this.get_log_statement.get(id);
      if (log === undefined) {
        return { success: false, msg: "Log not found" };
      }
      return { success: true, log };
    });
  }
}
