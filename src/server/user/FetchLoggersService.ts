import { UserData } from "../../model/db/UserModel";
import { FetchLoggersSuccess } from "../database/users/UserDao";
import { FailureMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IFetchLoggersService {
  fetch_loggers(requesting_user: UserData): FetchLoggersSuccess | FailureMsg;
}

export class FetchLoggersService implements IFetchLoggersService {
  constructor(private readonly user_service: IUserService) {}

  public fetch_loggers(requesting_user: UserData): FetchLoggersSuccess | FailureMsg {
    if (!requesting_user.is_admin) {
      return { success: false, msg: "You don't have permission to do that." };
    }

    return this.user_service.server_app.user_dao.fetch_logger_list();
  }
}
