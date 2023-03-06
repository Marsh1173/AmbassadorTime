import { UserData, UserPerms } from "../../model/db/UserModel";
import { ValidateLoginReturnMsg } from "../authentication/utils/ClientValidator";
import { ActionLogService } from "../logging/ActionLogService";
import { BoolReturnMsg, FORBIDDEN, ReturnMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IDeleteLoggerService {
  attempt_delete_logger(
    user_data: UserData,
    user_id_to_delete: string,
    password: string
  ): ReturnMsg;
}

export class DeleteLoggerService implements IDeleteLoggerService {
  constructor(private readonly user_service: IUserService) {}

  public attempt_delete_logger(
    user_data: UserData,
    user_id_to_delete: string,
    password: string
  ): ReturnMsg {
    if (user_data.perms !== UserPerms.Admin) {
      return FORBIDDEN;
    }

    let validate_password: ValidateLoginReturnMsg =
      this.user_service.server_app.user_dao.validate_login({
        password,
        id: user_data.id,
      });
    if (!validate_password.success) {
      return { success: false, msg: "Incorrect password" };
    }

    let if_user_to_delete_is_admin: BoolReturnMsg =
      this.user_service.server_app.user_dao.is_admin(user_id_to_delete);
    if (!if_user_to_delete_is_admin.success) {
      return { success: false, msg: "User not found." };
    } else if (if_user_to_delete_is_admin.result) {
      return { success: false, msg: "You cannot delete an admin." };
    }

    let delete_user_results: ReturnMsg =
      this.user_service.server_app.user_dao.delete_user(user_id_to_delete);

    if (delete_user_results.success) {
      ActionLogService.log_action.delete_account(user_data, user_id_to_delete);
      this.user_service.user_client_map.on_logger_delete(user_id_to_delete);
    }

    return delete_user_results;
  }
}
