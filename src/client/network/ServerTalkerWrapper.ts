import { HasId, Id, make_id } from "../../model/utils/Id";
import { IClientApp } from "../application/ClientApp";
import { IServerTalker } from "./ServerTalker";
import { ClientMessage } from "../../server/network/api/ServerApi";
import { ServerMessage } from "./api/ClientApi";

export interface IServerTalkerWrapper extends HasId {
  receive_message: (msg: ServerMessage) => void;
  on_server_talker_close: (msg: string) => void;
  deconstruct(): IServerTalker;
}

export abstract class ServerTalkerWrapper implements IServerTalkerWrapper {
  public readonly id: Id;
  protected is_deconstructed: boolean = false;

  constructor(
    private readonly server_talker: IServerTalker,
    private readonly client_app: IClientApp
  ) {
    this.id = make_id();
    this.server_talker.add_observer(this);
  }

  public abstract receive_message(msg: ServerMessage): void;

  public on_server_talker_close(msg: string): void {
    this.client_app.change_state_to_disconnected(msg);
  }

  protected send(data: ClientMessage) {
    if (this.is_deconstructed) {
      console.error("Tried to send to a deconstructed server talker");
    } else {
      this.server_talker.send(data);
    }
  }

  public deconstruct(): IServerTalker {
    this.is_deconstructed = true;
    this.server_talker.remove_observer(this.id);

    return this.server_talker;
  }
}
