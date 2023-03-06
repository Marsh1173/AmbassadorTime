import { UserData, UserPerms } from "../../model/db/UserModel";
import { LogModelSuccess } from "../database/logs/LogDao";
import { ActionLogService } from "../logging/ActionLogService";
import { CreateLogMsg } from "../network/api/user/CreateLog";
import { FailureMsg, FORBIDDEN, ReturnMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface ICreateLogService {
  attempt_create_log(
    user_data: UserData,
    short_description: string,
    target_date_time_ms: number,
    minutes_logged: number
  ): FailureMsg | LogModelSuccess;
}

export class CreateLogService implements ICreateLogService {
  constructor(private readonly user_service: IUserService) {}
  public attempt_create_log(
    user_data: UserData,
    short_description: string,
    target_date_time_ms: number,
    minutes_logged: number
  ): FailureMsg | LogModelSuccess {
    if (user_data.perms !== UserPerms.Logger) {
      return FORBIDDEN;
    }

    let results = this.user_service.server_app.log_dao.create_log(
      {
        short_description,
        target_date_time_ms,
        minutes_logged,
      },
      user_data
    );

    if (results.success) {
      ActionLogService.log_action.create_log(user_data);
    }

    return results;
  }
}
