import { UserData, UserId } from "../../../model/db/UserModel";
import {
  ClientMessage,
  ClientMessageNotImplemented,
} from "../../network/api/ServerApi";
import { IClient } from "../../network/client/Client";
import { ClientWrapper } from "../../network/client/ClientWrapper";
import { IUserService } from "../UserService";
import { UserClientMap } from "./UserClientMap";

export class UserClientWrapper extends ClientWrapper {
  constructor(
    private readonly user_service: IUserService,
    client: IClient,
    client_map: UserClientMap,
    public readonly user_data: UserData
  ) {
    super(client, client_map);
  }

  public receive_message(msg: ClientMessage, client_id: string): void {
    if (msg.type !== "ClientUserMessage") {
      return;
    }

    // switch (msg.msg.type) {
    //   default:
    //     throw new ClientMessageNotImplemented(msg);
    // }
  }

  public on_client_close(id: UserId): void {
    super.on_client_close(id);
    this.user_service.server_app.auth_service.authenticated_client_tracker.disconnect_authenticated_client(
      this.user_data.id
    );
  }

  protected log_disconnection(): void {
    console.log(
      "Disconnected from authenticated client " + this.user_data.displayname
    );
  }
}
