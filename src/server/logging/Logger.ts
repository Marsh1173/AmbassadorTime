import { writeFileSync } from "fs";
import { ServerConfig } from "../utils/ServerConfig";

const BASE_PATH: string = "logs/";

const LOG_FILE_PATHS = {
  logs: BASE_PATH + "logs",
  actions: BASE_PATH + "actions",
  errors: BASE_PATH + "errors",
  db: BASE_PATH + "database",
};

export class Logger {
  private static is_development: boolean = false;

  public static init_logs(config: ServerConfig) {
    Logger.is_development = config.is_development;

    if (!Logger.is_development) {
      console.error = function (message) {
        Logger.log_error(message);
      };
      console.log = function (message) {
        Logger.log(message);
      };
    }
  }

  private static log_to_file = (msg: any, path: string) => {
    let date: Date = new Date();
    let dated_msg: string = Logger.get_date_time_str(date) + msg + `\n`;
    path += Logger.get_month_year_str(date) + ".log";
    writeFileSync(path, dated_msg, { flag: "a" });
  };

  public static log = (msg: any) =>
    Logger.log_to_file(msg, LOG_FILE_PATHS.logs);
  public static log_error = (msg: any) =>
    Logger.log_to_file(msg, LOG_FILE_PATHS.errors);
  public static log_db = (msg: any) =>
    Logger.log_to_file(msg, LOG_FILE_PATHS.db);
  public static log_action = (msg: any) =>
    Logger.log_to_file(msg, LOG_FILE_PATHS.actions);

  private static readonly time_zone: string = "MST";
  private static get_date_time_str(date: Date): string {
    return (
      date.toLocaleString("en-US", { timeZone: Logger.time_zone }) +
      " (" +
      Logger.time_zone +
      ") - "
    );
  }

  private static get_month_year_str(date: Date): string {
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString();
  }
}
