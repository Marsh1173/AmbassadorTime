import { IServerApp } from "../application/ServerApp";
import { UserClientMap } from "./client/UserClientMap";

export interface IUserService {
  readonly server_app: IServerApp;
  readonly user_client_map: UserClientMap;
}

export class UserService implements IUserService {
  public readonly user_client_map: UserClientMap;
  constructor(public readonly server_app: IServerApp) {
    this.user_client_map = new UserClientMap(this);
  }
}
