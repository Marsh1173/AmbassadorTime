import { readFile } from "fs";
import { UserData, UserId } from "../../model/db/UserModel";
import { Logger } from "./Logger";

export abstract class ActionLogService {
  public static log_action = {
    account_creation: (
      creator_data: UserData,
      new_display_name: string,
      new_user_id: UserId
    ) => {
      Logger.log_action(
        creator_data.id +
          ' created a new user with name "' +
          new_display_name +
          '" and id "' +
          new_user_id +
          '".'
      );
    },
    change_password: (user_data: UserData) => {
      Logger.log_action(user_data.id + " changed their password.");
    },
    delete_account: (deletor: UserData, deleted_id: UserId) => {
      Logger.log_action(deletor.id + " deleted user " + deleted_id + ".");
    },
    create_log: (user_data: UserData) => {
      Logger.log_action(user_data.id + " logged hours.");
    },
    delete_log: (user_data: UserData) => {
      Logger.log_action(user_data.id + " deleted a log.");
    },
  };

  public static get_log_file_str(
    year: number,
    month: number,
    callback: (val: string | undefined) => void
  ) {
    readFile(
      Logger.get_action_log_filename(year, month),
      (err: NodeJS.ErrnoException | null, data: Buffer | undefined) => {
        if (data === undefined) {
          callback(undefined);
          return;
        }
        try {
          callback(data.toString());
        } catch {
          callback(undefined);
        }
      }
    );
  }

  // private static log_file_path: string = "src/server/logging/actions/";
  // private static log_action_to_file(msg: any) {
  //   let date = new Date();
  //   let path: string =
  //     ActionLogService.log_file_path +
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString() +
  //     ".log";
  //   Logger.log_action(msg);
  // }

  // /**
  //  * For testing purposes only.
  //  */
  // public static override_log_file_path(new_path: string) {
  //   ActionLogService.log_file_path = new_path;
  // }
}
