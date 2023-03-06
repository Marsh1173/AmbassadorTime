import { UserData, UserPerms } from "../../model/db/UserModel";
import { ActionLogService } from "../logging/ActionLogService";
import { FORBIDDEN, ReturnMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IChangePasswordService {
  attempt_change_password(user_data: UserData, new_password: string): ReturnMsg;
}

export class ChangePasswordService implements IChangePasswordService {
  constructor(private readonly user_service: IUserService) {}

  public attempt_change_password(
    user_data: UserData,
    new_password: string
  ): ReturnMsg {
    if (user_data.perms === UserPerms.Admin) {
      return FORBIDDEN;
    }

    let results: ReturnMsg =
      this.user_service.server_app.user_dao.change_user_password(
        new_password,
        user_data.id
      );

    if (results.success) {
      ActionLogService.log_action.change_password(user_data);
    }

    return results;
  }
}
