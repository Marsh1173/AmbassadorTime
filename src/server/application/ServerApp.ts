const express = require("express");
import { Logger } from "../logging/Logger";
import { Application } from "express-ws";
import {
  IWebsocketListener,
  WebsocketListener,
} from "../network/WebsocketListener";
import { ServerConfig } from "../utils/ServerConfig";
import { IServerListener, ServerListener } from "../network/ServerListener";
import {
  AuthenticationService,
  IAuthenticationService,
} from "../authentication/AuthenticationService";
import { UserDao } from "../database/users/UserDao";
import { DB } from "../database/utils/DB";
import { IUserService, UserService } from "../user/UserService";
import { LogDao } from "../database/logs/LogDao";

export interface IServerApp {
  readonly auth_service: IAuthenticationService;
  readonly user_service: IUserService;
  readonly user_dao: UserDao;
  readonly log_dao: LogDao;
}

export class ServerApp implements IServerApp {
  private readonly server_listener: IServerListener;
  private readonly websocket_listener: IWebsocketListener;
  private readonly app: Application;

  public readonly auth_service: IAuthenticationService;
  public readonly user_service: IUserService;

  public readonly user_dao: UserDao;
  public readonly log_dao: LogDao;

  constructor(private readonly config: ServerConfig) {
    //logger
    Logger.init_logs(this.config);

    //database
    let db = DB.init();
    this.user_dao = new UserDao(db);
    this.log_dao = new LogDao(db);

    //network listeners
    this.app = express();
    this.websocket_listener = new WebsocketListener(this, config, this.app);
    this.server_listener = new ServerListener(config, this.app);
    this.server_listener.start_server_listener();
    this.websocket_listener.start_websocket_listener();

    //services
    this.auth_service = new AuthenticationService(this);
    this.user_service = new UserService(this);
  }
}
