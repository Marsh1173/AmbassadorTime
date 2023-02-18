import { IClient } from "../../network/client/Client";
import { ClientMap } from "../../network/client/ClientMap";
import { IAuthenticationService } from "../AuthenticationService";
import { UnauthenticatedClientWrapper } from "./UnauthenticatedClientWrapper";

export class UnauthenticatedClientMap extends ClientMap<UnauthenticatedClientWrapper> {
  constructor(private readonly auth_service: IAuthenticationService) {
    super();
  }

  public attach_client(client: IClient): UnauthenticatedClientWrapper {
    let client_wrapper: UnauthenticatedClientWrapper =
      new UnauthenticatedClientWrapper(this.auth_service, client, this);
    this.attach_client_to_map(client_wrapper);
    return client_wrapper;
  }
}
