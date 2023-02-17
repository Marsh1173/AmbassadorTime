import { HasId, Id, make_id } from "../../model/utils/Id";
import { IServerTalker } from "./ServerTalker";

export interface IServerTalkerWrapper extends HasId {
  receive_message: (msg: any) => void;
  on_server_talker_close: () => void;
  deconstruct(): IServerTalker;
}

export abstract class ServerTalkerWrapper implements IServerTalkerWrapper {
  public readonly id: Id;
  protected is_deconstructed: boolean = false;

  constructor(private readonly server_talker: IServerTalker) {
    this.id = make_id();
    this.server_talker.add_observer(this);
  }

  public abstract receive_message(msg: any): void;
  public abstract on_server_talker_close(): void;

  protected send(data: any) {
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
