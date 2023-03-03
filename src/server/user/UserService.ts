import { IServerApp } from "../application/ServerApp";
import {
  ChangePasswordService,
  IChangePasswordService,
} from "./ChangePasswordService";
import { FetchLogsService, IFetchLogsService } from "./FetchLogsService";
import { UserClientMap } from "./client/UserClientMap";
import { FetchUsersService, IFetchUsersService } from "./FetchUsersService";

export interface IUserService {
  readonly server_app: IServerApp;
  readonly user_client_map: UserClientMap;
  readonly change_password_service: IChangePasswordService;
  readonly fetch_users_service: IFetchUsersService;
  readonly fetch_logs_service: IFetchLogsService;
}

export class UserService implements IUserService {
  public readonly user_client_map: UserClientMap;
  public readonly change_password_service: IChangePasswordService;
  public readonly fetch_users_service: IFetchUsersService;
  public readonly fetch_logs_service: IFetchLogsService;

  constructor(public readonly server_app: IServerApp) {
    this.user_client_map = new UserClientMap(this);
    this.change_password_service = new ChangePasswordService(this);
    this.fetch_users_service = new FetchUsersService(this);
    this.fetch_logs_service = new FetchLogsService(this);
  }
}
