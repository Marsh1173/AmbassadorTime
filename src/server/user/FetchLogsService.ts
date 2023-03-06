import { UserData, UserPerms } from "../../model/db/UserModel";
import { FetchLogsSuccess } from "../database/logs/LogDao";
import { FailureMsg, FORBIDDEN } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IFetchLogsService {
  fetch_user_logs(user_data: UserData): FetchLogsSuccess | FailureMsg;
  fetch_all_logs(user_data: UserData): FetchLogsSuccess | FailureMsg;
}

export class FetchLogsService implements IFetchLogsService {
  constructor(private readonly user_service: IUserService) {}

  public fetch_user_logs(user_data: UserData): FetchLogsSuccess | FailureMsg {
    if (user_data.perms !== UserPerms.Logger) {
      return FORBIDDEN;
    }
    return this.user_service.server_app.log_dao.get_user_logs(user_data.id);
  }

  public fetch_all_logs(user_data: UserData): FetchLogsSuccess | FailureMsg {
    if (user_data.perms !== UserPerms.Admin) {
      return FORBIDDEN;
    }
    return this.user_service.server_app.log_dao.get_all_logs();
  }
}
