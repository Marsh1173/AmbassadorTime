import { IServerApp } from "../application/ServerApp";
import { ChangePasswordService, IChangePasswordService } from "./ChangePasswordService";
import { UserClientMap } from "./client/UserClientMap";
import { FetchLoggersService, IFetchLoggersService } from "./FetchLoggersService";

export interface IUserService {
  readonly server_app: IServerApp;
  readonly user_client_map: UserClientMap;
  readonly change_password_service: IChangePasswordService;
  readonly fetch_loggers_service: IFetchLoggersService;
}

export class UserService implements IUserService {
  public readonly user_client_map: UserClientMap;
  public readonly change_password_service: IChangePasswordService;
  public readonly fetch_loggers_service: IFetchLoggersService;

  constructor(public readonly server_app: IServerApp) {
    this.user_client_map = new UserClientMap(this);
    this.change_password_service = new ChangePasswordService(this);
    this.fetch_loggers_service = new FetchLoggersService(this);
  }
}
