import { DAO, FailureMsg, ReturnMsg, SuccessMsg } from "../utils/Dao";
import BetterSqlite3 from "better-sqlite3";
import { LogId, LogModel } from "./LogModel";
import { HasId, make_id } from "../../../model/utils/Id";
import { UserId } from "../../../model/db/UserModel";

export interface ILogDao {
  create_log(
    data: Pick<
      LogModel,
      "short_description" | "target_date_time_ms" | "minutes_logged" | "user_id"
    >
  ): LogSuccess | FailureMsg;
  delete_log(id: LogId): ReturnMsg;
  edit_log(log_data: Partial<LogModel> & HasId): LogSuccess | FailureMsg;
  get_user_logs_batch(
    user_id: UserId,
    last_fetched_log_id?: LogId
  ): FetchLogBatchSuccess | FailureMsg;
  get_all_logs_batch(
    last_fetched_log_id?: LogId
  ): FetchLogBatchSuccess | FailureMsg;
}

export interface LogSuccess extends SuccessMsg {
  log: LogModel;
}

export interface FetchLogBatchSuccess extends SuccessMsg {
  logs: LogModel[];
}

export class LogDao extends DAO implements ILogDao {
  private readonly insert_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly delete_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly edit_log_statement: BetterSqlite3.Statement<any[]>;
  private readonly get_log_statement: BetterSqlite3.Statement<any[]>;

  constructor(
    private readonly db: BetterSqlite3.Database,
    private readonly table_name: string = "logs"
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
      `SELECT * FROM ${this.table_name} WHERE id = ?;`
    );
  }

  public create_log(
    data: Pick<
      LogModel,
      "short_description" | "target_date_time_ms" | "minutes_logged" | "user_id"
    >
  ): LogSuccess | FailureMsg {
    return this.catch_database_errors_get<LogSuccess>(() => {
      let now: number = Date.now();
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
    });
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
      let log: LogModel | undefined = this.get_log_statement.get(log_data.id);
      if (log === undefined) {
        return { success: false, msg: "Log not found" };
      }

      log = { ...log, ...log_data };
      this.edit_log_statement.run(
        log.short_description,
        log.target_date_time_ms,
        log.minutes_logged,
        log.time_logged_ms
      );
      return { success: true, log };
    });
  }

  public get_user_logs_batch(
    user_id: string,
    last_fetched_log_id?: string | undefined
  ): FailureMsg | FetchLogBatchSuccess {
    throw new Error("Method not implemented.");
  }

  public get_all_logs_batch(
    last_fetched_log_id?: string | undefined
  ): FailureMsg | FetchLogBatchSuccess {
    throw new Error("Method not implemented.");
  }
}
