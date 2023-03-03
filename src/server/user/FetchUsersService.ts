import { UserData, UserPerms } from "../../model/db/UserModel";
import { FetchUsersSuccess } from "../database/users/UserDao";
import { FailureMsg } from "../utils/ReturnMsg";
import { IUserService } from "./UserService";

export interface IFetchUsersService {
  fetch_users(requesting_user: UserData): FetchUsersSuccess | FailureMsg;
}

export class FetchUsersService implements IFetchUsersService {
  constructor(private readonly user_service: IUserService) {}

  public fetch_users(
    requesting_user: UserData
  ): FetchUsersSuccess | FailureMsg {
    if (requesting_user.perms !== UserPerms.Admin) {
      return { success: false, msg: "You don't have permission to do that." };
    }

    return this.user_service.server_app.user_dao.fetch_users_list();
  }
}
