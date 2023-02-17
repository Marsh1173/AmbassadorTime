import { Id } from "../../model/utils/Id";
import { IServerApp } from "../application/ServerApp";
import { ReturnMsg } from "../database/utils/Dao";
import { IClient } from "../network/client/Client";
import {
  AuthenticatedClientTracker,
  IAuthenticatedClientTracker,
} from "./AuthenticatedClientTracker";
import {
  IUnauthenticatedClientWrapper,
  UnauthenticatedClientWrapper,
} from "./UnauthenticatedClientWrapper";

export interface IAuthenticationService {
  attach_client(client: IClient): void;
  disconnect_client(id: Id): void;
  attempt_validate_client_login(): ReturnMsg;
}

export class AuthenticationService implements IAuthenticationService {
  private readonly unauthenticated_clients: Map<
    Id,
    IUnauthenticatedClientWrapper
  > = new Map();
  private readonly authenticated_client_tracker: IAuthenticatedClientTracker;

  constructor(private readonly server_app: IServerApp) {
    this.authenticated_client_tracker = new AuthenticatedClientTracker();
  }

  public attach_client(client: IClient): void {
    let client_wrapper: IUnauthenticatedClientWrapper =
      new UnauthenticatedClientWrapper(this, client);
    this.unauthenticated_clients.set(client_wrapper.id, client_wrapper);
  }

  public disconnect_client(id: Id): void {
    this.unauthenticated_clients.delete(id);
  }

  public attempt_validate_client_login(): ReturnMsg {
    throw new Error("Method not implemented.");
  }
}
