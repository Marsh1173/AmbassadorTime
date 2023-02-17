import { Id } from "../../model/utils/Id";
import { IClient } from "../network/client/Client";
import { IAuthenticationService } from "./AuthenticationService";
import {
  IUnauthenticatedClientWrapper,
  UnauthenticatedClientWrapper,
} from "./UnauthenticatedClientWrapper";

export interface IUnauthenticatedClientTracker {
  attach_client(client: IClient): void;
  disconnect_client(id: Id): void;
}

export class UnauthenticatedClientTracker
  implements IUnauthenticatedClientTracker
{
  private readonly unauthenticated_clients: Map<
    Id,
    IUnauthenticatedClientWrapper
  > = new Map();

  constructor(private readonly auth_service: IAuthenticationService) {}

  public attach_client(client: IClient): void {
    let client_wrapper: IUnauthenticatedClientWrapper =
      new UnauthenticatedClientWrapper(this.auth_service, client);
    this.unauthenticated_clients.set(client_wrapper.id, client_wrapper);
  }

  public disconnect_client(id: Id): void {
    this.unauthenticated_clients.delete(id);
  }
}
