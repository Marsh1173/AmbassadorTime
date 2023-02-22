import BetterSqlite3 from "better-sqlite3";
import { LogId, LogModel } from "../../../model/db/LogModel";
import { HasId, make_id } from "../../../model/utils/Id";
import { UserId } from "../../../model/db/UserModel";
import { ValidateLog } from "./utils/ValidateLog";
import { FailureMsg, ReturnMsg, Success } from "../../utils/ReturnMsg";
import { DAO } from "../utils/Dao";

export const user_does_not_exist: string = "User does not exist";

export const create_log_table_string = (table_name: string, user_table_name: string) => {
  return `CREATE TABLE '${table_name}' (\
    'id' VARCHAR(50) PRIMARY KEY NOT NULL,\
    'short_description' VARCHAR(30) NOT NULL,\
    'target_date_time_ms' INT NOT NULL,\
    'minutes_logged' INT NOT NULL,\
    'time_logged_ms' INT NOT NULL,\
    'user_id' BOOLEAN NOT NULL,\
    FOREIGN KEY (user_id) REFERENCES ${user_table_name}(id)\
    );`;
};

export interface ILogDao {
  create_log(
    data: Pick<LogModel, "short_description" | "target_date_time_ms" | "minutes_logged" | "user_id">
  ): LogSuccess | FailureMsg;
  delete_log(id: LogId): ReturnMsg;
  edit_log(log_data: Partial<LogModel> & HasId): LogSuccess | FailureMsg;
  get_user_logs(user_id: UserId): FetchLogBatchSuccess | FailureMsg;
  get_all_logs(): FetchLogBatchSuccess | FailureMsg;
}

export interface LogSuccess extends Success {
  log: LogModel;
}

export interface FetchLogBatchSuccess extends Success {
  logs: LogModel[];
}

export class LogDao extends DAO implements ILogDao {
  private readonly insert_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly delete_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly edit_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_user_logs_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_all_logs_statement: BetterSqlite3.Statement<any[]>;

  constructor(private readonly db: BetterSqlite3.Database, private readonly table_name: string = "logs") {
    super();

    this.insert_log_statement = this.db.prepare(
      `INSERT INTO ${this.table_name} (id, short_description, target_date_time_ms, minutes_logged, time_logged_ms, user_id) VALUES (?, ?, ?, ?, ?, ?);`
    );

    this.delete_log_statement = this.db.prepare(`DELETE FROM ${this.table_name} WHERE id = ?`);

    this.edit_log_statement = this.db.prepare(
      `UPDATE ${this.table_name} SET short_description = ?, target_date_time_ms = ?, minutes_logged = ?, time_logged_ms = ? WHERE id = ?`
    );

    this.get_log_statement = this.db.prepare(`SELECT * FROM ${this.table_name} WHERE id = ?;`);

    this.get_user_logs_statement = this.db.prepare(
      `SELECT * FROM ${this.table_name} WHERE user_id = ? ORDER BY target_date_time_ms DESC;`
    );

    this.get_all_logs_statement = this.db.prepare(
      `SELECT * FROM ${this.table_name} ORDER BY target_date_time_ms DESC;`
    );
  }

  public create_log(
    data: Pick<LogModel, "short_description" | "target_date_time_ms" | "minutes_logged" | "user_id">
  ): LogSuccess | FailureMsg {
    return this.catch_database_errors_get<LogSuccess>(() => {
      let now: number = Date.now();

      let validate_log_results: ReturnMsg = ValidateLog.validate_log(now, data.target_date_time_ms);
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
        data.user_id
      );
      return { success: true, log: { ...data, id, time_logged_ms: now } };
    }, new Map([["SQLITE_CONSTRAINT_FOREIGNKEY", user_does_not_exist]]));
  }

  public delete_log(id: string): ReturnMsg {
    return this.catch_database_errors_run(() => {
      this.delete_log_statement.run(id);
      return { success: true };
    });
  }

  public edit_log(log_data: Partial<LogModel> & HasId): LogSuccess | FailureMsg {
    return this.catch_database_errors_get<LogSuccess>(() => {
      let get_log_results: LogSuccess | FailureMsg = this.get_log(log_data.id);
      if (!get_log_results.success) {
        return get_log_results;
      }

      let log: LogModel = { ...get_log_results.log, ...log_data };
      this.edit_log_statement.run(
        log.short_description,
        log.target_date_time_ms,
        log.minutes_logged,
        log.time_logged_ms
      );
      return { success: true, log };
    });
  }

  public get_user_logs(user_id: string): FailureMsg | FetchLogBatchSuccess {
    return this.catch_database_errors_get<FetchLogBatchSuccess>(() => {
      return { success: true, logs: this.get_user_logs_statement.all(user_id) };
    });
  }

  public get_all_logs(): FailureMsg | FetchLogBatchSuccess {
    return this.catch_database_errors_get<FetchLogBatchSuccess>(() => {
      return { success: true, logs: this.get_all_logs_statement.all() };
    });
  }

  public get_log(id: LogId): LogSuccess | FailureMsg {
    return this.catch_database_errors_get<LogSuccess>(() => {
      let log: LogModel | undefined = this.get_log_statement.get(id);
      if (log === undefined) {
        return { success: false, msg: "Log not found" };
      }
      return { success: true, log };
    });
  }
}
