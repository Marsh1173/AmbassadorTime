import { readFile } from "fs";
import { UserData } from "../../model/db/UserModel";
import { Logger } from "./Logger";

export abstract class ActionLogService {
  public static log_action = {
    account_creation: (creator_data: UserData, new_user_data: UserData) => {
      Logger.log_action(
        creator_data.id +
          " created a new user with name " +
          new_user_data.displayname +
          " and id " +
          new_user_data.id +
          "."
      );
    },
    promotion: (
      promotor_data: UserData,
      newly_promoted_user_data: UserData
    ) => {
      Logger.log_action(
        promotor_data.id +
          " promoted user " +
          newly_promoted_user_data.id +
          " to admin."
      );
    },
    demotion: (demotor_data: UserData, newly_demoted_user_data: UserData) => {
      Logger.log_action(
        demotor_data.id +
          " demoted user " +
          newly_demoted_user_data.id +
          " to admin."
      );
    },
    change_password: (user_data: UserData) => {
      Logger.log_action(user_data.id + " changed their password.");
    },
    delete_account: (deletor: UserData, deleted: UserData) => {
      Logger.log_action(
        deletor.id + " deleted user " + deleted.id + " and all of their data."
      );
    },
  };

  public static get_log_file_str(
    year: string,
    month: string,
    callback: (val: string | undefined) => void
  ) {
    readFile(
      Logger.get_action_log_filename(year, month),
      (err: NodeJS.ErrnoException | null, data: Buffer | undefined) => {
        if (data === undefined) return undefined;
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
