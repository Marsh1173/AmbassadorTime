import { UserData } from "../../../model/db/UserModel";
import { IClient } from "../../network/client/Client";
import { ClientMap } from "../../network/client/ClientMap";
import { IUserService } from "../UserService";
import { UserClientWrapper } from "./UserClientWrapper";

export class UserClientMap extends ClientMap<UserClientWrapper> {
  constructor(private readonly user_service: IUserService) {
    super();
  }

  public attach_client(
    client: IClient,
    user_data: UserData
  ): UserClientWrapper {
    let client_wrapper: UserClientWrapper = new UserClientWrapper(
      this.user_service,
      client,
      this,
      user_data
    );
    this.attach_client_to_map(client_wrapper);
    return client_wrapper;
  }
}
