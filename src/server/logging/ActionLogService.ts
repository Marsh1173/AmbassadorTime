import { UserData } from "../database/users/UserModel";
import { Logger } from "./Logger";

export abstract class ActionLogService {
  public static log_action = {
    account_creation: (creator_data: UserData, new_user_data: UserData) => {
      ActionLogService.log_action_to_file(
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
      ActionLogService.log_action_to_file(
        promotor_data.id +
          " promoted user " +
          newly_promoted_user_data.id +
          " to admin."
      );
    },
    demotion: (demotor_data: UserData, newly_demoted_user_data: UserData) => {
      ActionLogService.log_action_to_file(
        demotor_data.id +
          " demoted user " +
          newly_demoted_user_data.id +
          " to admin."
      );
    },
    change_password: (user_data: UserData) => {
      ActionLogService.log_action_to_file(
        user_data.id + " changed their password."
      );
    },
    delete_account: (deletor: UserData, deleted: UserData) => {
      ActionLogService.log_action_to_file(
        deletor.id + " deleted user " + deleted.id + " and all of their data."
      );
    },
  };

  private static log_file_path: string = "src/server/logging/actions/";
  private static log_action_to_file(msg: any) {
    let date = new Date();
    let path: string =
      ActionLogService.log_file_path +
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString() +
      ".log";
    Logger.log_action(msg);
  }

  /**
   * For testing purposes only.
   */
  public static override_log_file_path(new_path: string) {
    ActionLogService.log_file_path = new_path;
  }
}
