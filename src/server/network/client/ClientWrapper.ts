import { HasId, Id, make_id } from "../../../model/utils/Id";
import { ClientMessage } from "../api/ServerApi";
import { ServerMessage } from "../../../client/network/api/ClientApi";
import { IClient } from "./Client";
import { ClientMap } from "./ClientMap";
import { UserId } from "../../../model/db/UserModel";
import { ReturnMsg } from "../../utils/ReturnMsg";

export abstract class ClientWrapper implements HasId {
  public readonly id: Id;
  protected is_deconstructed: boolean = false;

  constructor(private readonly client: IClient, private readonly client_map: ClientMap<ClientWrapper>) {
    this.id = make_id();
    this.client.add_observer(this);
  }

  public abstract receive_message(msg: ClientMessage, client_id: string): void;

  public on_client_close(id: UserId): void {
    this.client_map.disconnect_client(this.id);
    this.log_disconnection();
  }
  protected abstract log_disconnection(): void;

  protected send(data: ServerMessage) {
    if (this.is_deconstructed) {
      console.error("Tried to send to a deconstructed client wrapper");
    } else {
      this.client.send(data);
    }
  }

  public deconstruct(): IClient {
    this.is_deconstructed = true;
    this.client.remove_observer(this.id);
    this.client_map.disconnect_client(this.id);

    return this.client;
  }

  protected communicate_success_or_failure_action(msg: ReturnMsg) {
    if (msg.success) {
      this.send({
        type: "ServerUserMessage",
        msg: {
          type: "SuccessMsg",
          msg: "Success!",
        },
      });
    } else {
      this.send({
        type: "ServerUserMessage",
        msg: {
          type: "FailureMsg",
          msg: msg.msg,
        },
      });
    }
  }
}
