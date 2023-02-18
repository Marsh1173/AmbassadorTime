import { IServerApp } from "../application/ServerApp";
import {
  AuthenticatedClientTracker,
  IAuthenticatedClientTracker,
} from "./utils/AuthenticatedClientTracker";
import { ClientValidator, IClientValidator } from "./utils/ClientValidator";
import { UnauthenticatedClientMap } from "./client/UnauthenticatedClientMap";

export interface IAuthenticationService {
  readonly server_app: IServerApp;
  readonly unauthenticated_client_map: UnauthenticatedClientMap;
  readonly authenticated_client_tracker: IAuthenticatedClientTracker;
  readonly client_validator: IClientValidator;
}

export class AuthenticationService implements IAuthenticationService {
  public readonly unauthenticated_client_map: UnauthenticatedClientMap;
  public readonly authenticated_client_tracker: IAuthenticatedClientTracker;
  public readonly client_validator: IClientValidator;

  constructor(public readonly server_app: IServerApp) {
    this.unauthenticated_client_map = new UnauthenticatedClientMap(this);
    this.authenticated_client_tracker = new AuthenticatedClientTracker();
    this.client_validator = new ClientValidator(this);
  }
}
