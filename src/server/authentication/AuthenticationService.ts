import { IServerApp } from "../application/ServerApp";
import {
  AuthenticatedClientTracker,
  IAuthenticatedClientTracker,
} from "./AuthenticatedClientTracker";
import { ClientValidator, IClientValidator } from "./ClientValidator";
import {
  IUnauthenticatedClientTracker,
  UnauthenticatedClientTracker,
} from "./UnauthenticatedClientTracker";

export interface IAuthenticationService {
  readonly server_app: IServerApp;
  readonly unauthenticated_client_tracker: IUnauthenticatedClientTracker;
  readonly authenticated_client_tracker: IAuthenticatedClientTracker;
  readonly client_validator: IClientValidator;
}

export class AuthenticationService implements IAuthenticationService {
  public readonly unauthenticated_client_tracker: IUnauthenticatedClientTracker;
  public readonly authenticated_client_tracker: IAuthenticatedClientTracker;
  public readonly client_validator: IClientValidator;

  constructor(public readonly server_app: IServerApp) {
    this.unauthenticated_client_tracker = new UnauthenticatedClientTracker(
      this
    );
    this.authenticated_client_tracker = new AuthenticatedClientTracker();
    this.client_validator = new ClientValidator(this);
  }
}
