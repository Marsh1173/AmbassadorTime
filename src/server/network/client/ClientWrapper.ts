import { HasId, Id, make_id } from "../../../model/utils/Id";
import { ClientMessage } from "../api/ServerApi";
import { ServerMessage } from "../../../client/network/api/ClientApi";
import { IClient } from "./Client";

export interface IClientWrapper extends HasId {
  receive_message(msg: ClientMessage, client_id: Id): void;
  on_client_close(client_id: Id): void;
  deconstruct(): IClient;
}

export abstract class ClientWrapper implements IClientWrapper {
  public readonly id: Id;
  protected is_deconstructed: boolean = false;

  constructor(private readonly client: IClient) {
    this.id = make_id();
    this.client.add_observer(this);
  }

  public abstract receive_message(msg: ClientMessage, client_id: string): void;
  public abstract on_client_close(): void;

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

    return this.client;
  }
}
