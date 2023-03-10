import Sqlite3 from "better-sqlite3";
import { ReturnMsg, FailureMsg } from "../../utils/ReturnMsg";

export abstract class DAO {
  constructor() {}

  protected catch_database_errors_run(
    f: () => ReturnMsg,
    sql_error_map: Map<string, string> | undefined = undefined
  ): ReturnMsg {
    return this.catch_database_errors_get<ReturnMsg>(() => {
      return f();
    }, sql_error_map);
  }

  protected catch_database_errors_get<ReturnType>(
    f: () => FailureMsg | ReturnType,
    sql_error_map: Map<string, string> | undefined = undefined
  ): FailureMsg | ReturnType {
    try {
      return f();
    } catch (e: unknown) {
      if (typeof e === "string") {
        console.error(e);
        return { success: false, msg: e };
      } else if (e instanceof Sqlite3.SqliteError) {
        if (sql_error_map) {
          let possible_msg: string | undefined = sql_error_map.get(e.code);
          if (possible_msg) {
            return { success: false, msg: possible_msg };
          }
        }
      }
      console.error(e);
      return { success: false, msg: "Error" };
    }
  }
}
