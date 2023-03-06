import { UserData, UserPerms } from "../../model/db/UserModel";
import { ActionLogService } from "../logging/ActionLogService";
import { FORBIDDEN, ReturnMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IRegisterLoggerService {
  attempt_register_logger(
    user_data: UserData,
    display_name: string,
    user_id: string
  ): ReturnMsg;
}

export class RegisterLoggerService implements IRegisterLoggerService {
  constructor(private readonly user_service: IUserService) {}

  public attempt_register_logger(
    user_data: UserData,
    display_name: string,
    user_id: string
  ): ReturnMsg {
    if (user_data.perms !== UserPerms.Admin) {
      return FORBIDDEN;
    }

    let register_results: ReturnMsg =
      this.user_service.server_app.user_dao.register_user({
        displayname: display_name,
        id: user_id,
        perms: UserPerms.Logger,
      });

    if (register_results.success) {
      ActionLogService.log_action.account_creation(
        user_data,
        display_name,
        user_id
      );
    }

    return register_results;
  }
}
