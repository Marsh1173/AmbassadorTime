import { ClientMessage } from "../network/api/ServerApi";
import { IClient } from "../network/client/Client";
import { ClientWrapper, IClientWrapper } from "../network/client/ClientWrapper";
import { IAuthenticationService } from "./AuthenticationService";

export interface IUnauthenticatedClientWrapper extends IClientWrapper {}

export class UnauthenticatedClientWrapper
  extends ClientWrapper
  implements IUnauthenticatedClientWrapper
{
  constructor(
    private readonly auth_service: IAuthenticationService,
    client: IClient
  ) {
    super(client);
  }

  public receive_message(msg: ClientMessage, client_id: string): void {
    throw new Error("Method not implemented.");
  }

  public on_client_close(): void {
    this.auth_service.disconnect_client(this.id);
  }
}
