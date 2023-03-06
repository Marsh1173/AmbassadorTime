import { LogId } from "../../model/db/LogModel";
import { UserData, UserPerms } from "../../model/db/UserModel";
import { ActionLogService } from "../logging/ActionLogService";
import { FORBIDDEN, ReturnMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IDeleteLogController {
  attempt_delete_log(user_data: UserData, log_id: LogId): ReturnMsg;
}

export class DeleteLogController implements IDeleteLogController {
  constructor(private readonly user_service: IUserService) {}
  public attempt_delete_log(user_data: UserData, log_id: LogId): ReturnMsg {
    if (user_data.perms !== UserPerms.Admin) {
      return FORBIDDEN;
    }

    let results = this.user_service.server_app.log_dao.delete_log(log_id);
    if (results.success) {
      ActionLogService.log_action.delete_log(user_data);
    }

    return results;
  }
}
