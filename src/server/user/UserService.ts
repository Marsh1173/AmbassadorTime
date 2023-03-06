import { IServerApp } from "../application/ServerApp";
import {
  ChangePasswordService,
  IChangePasswordService,
} from "./ChangePasswordService";
import { FetchLogsService, IFetchLogsService } from "./FetchLogsService";
import { UserClientMap } from "./client/UserClientMap";
import { FetchUsersService, IFetchUsersService } from "./FetchUsersService";
import {
  IRegisterLoggerService,
  RegisterLoggerService,
} from "./RegisterLoggerService";
import {
  DeleteLoggerService,
  IDeleteLoggerService,
} from "./DeleteLoggerService";
import { CreateLogService, ICreateLogService } from "./CreateLogService";
import {
  DeleteLogController,
  IDeleteLogController,
} from "./DeleteLogController";

export interface IUserService {
  readonly server_app: IServerApp;
  readonly user_client_map: UserClientMap;
  readonly change_password_service: IChangePasswordService;
  readonly fetch_users_service: IFetchUsersService;
  readonly fetch_logs_service: IFetchLogsService;
  readonly register_logger_service: IRegisterLoggerService;
  readonly delete_logger_service: IDeleteLoggerService;
  readonly create_log_service: ICreateLogService;
  readonly delete_log_controller: IDeleteLogController;
}

export class UserService implements IUserService {
  public readonly user_client_map: UserClientMap;
  public readonly change_password_service: IChangePasswordService;
  public readonly fetch_users_service: IFetchUsersService;
  public readonly fetch_logs_service: IFetchLogsService;
  public readonly register_logger_service: IRegisterLoggerService;
  public readonly delete_logger_service: IDeleteLoggerService;
  public readonly create_log_service: ICreateLogService;
  public readonly delete_log_controller: IDeleteLogController;

  constructor(public readonly server_app: IServerApp) {
    this.user_client_map = new UserClientMap(this);
    this.change_password_service = new ChangePasswordService(this);
    this.fetch_users_service = new FetchUsersService(this);
    this.fetch_logs_service = new FetchLogsService(this);
    this.register_logger_service = new RegisterLoggerService(this);
    this.delete_logger_service = new DeleteLoggerService(this);
    this.create_log_service = new CreateLogService(this);
    this.delete_log_controller = new DeleteLogController(this);
  }
}
