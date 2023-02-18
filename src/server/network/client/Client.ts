import WebSocket from "ws";
import { BufferedMessageReceiver } from "../../../model/utils/BufferedMessageReceiver";
import { HasId, Id } from "../../../model/utils/Id";
import { ServerConfig } from "../../utils/ServerConfig";
import { ClientMessage, ServerApiSchema } from "../api/ServerApi";
import { MsgParser } from "../api/utils/parsing/MsgParser";
import { ClientWrapper } from "./ClientWrapper";

export interface IClient extends HasId {
  send: (data: any) => void;
  add_observer: (new_observer: ClientWrapper) => void;
  remove_observer: (id: Id) => void;
}

export class Client
  extends BufferedMessageReceiver<ClientWrapper, string>
  implements IClient
{
  constructor(
    protected readonly config: ServerConfig,
    protected readonly ws: WebSocket,
    public readonly id: Id
  ) {
    super();
    ws.on("message", (msg: string) => {
      this.on_receive_message(msg);
    });

    ws.onclose = () => this.on_close();

    this.TIMEOUT_SECONDS = this.config.client_timeout_limit;
    this.reset_timeout_timer();
  }

  public send(data: any) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error("ERROR: TRIED TO SEND TO A CLOSED WEBSOCKET");
      console.log("ERROR: TRIED TO SEND TO A CLOSED WEBSOCKET");
      console.log("Message:");
      console.log(data.toString());
    }
  }

  protected on_close() {
    this.stop_timeout_timer();
    this.observers.forEach((observer) => {
      observer.on_client_close(this.id);
    });
  }

  /* MESSAGE RECEIVING (mostly implemented in the BufferedMessageReceiver class) */
  protected send_message_to_observers(
    observers: ClientWrapper[],
    msg: string
  ): void {
    let client_msg: ClientMessage | undefined =
      MsgParser.parse_msg<ClientMessage>(msg, ServerApiSchema);

    if (!client_msg) {
      if (this.config.is_development) {
        console.error("UNRECOGNIZED MESSAGE");
        console.error(msg);
      }
      return;
    }

    for (const observer of observers) {
      try {
        observer.receive_message(client_msg, this.id);
      } catch (err) {
        console.error(err);
      }
    }
    this.reset_timeout_timer();
  }

  /* TIMEOUT HANDLING */
  private readonly TIMEOUT_SECONDS: number;
  private timeout_handle: NodeJS.Timeout | undefined = undefined;
  private reset_timeout_timer() {
    if (this.TIMEOUT_SECONDS === 0) return;
    if (this.timeout_handle) clearTimeout(this.timeout_handle);
    this.timeout_handle = setTimeout(() => {
      console.log(
        "Timed out after " +
          this.TIMEOUT_SECONDS.toString() +
          " seconds: " +
          this.id.toString()
      );
      this.ws.close();
      this.timeout_handle = undefined;
    }, this.TIMEOUT_SECONDS * 1000);
  }

  protected stop_timeout_timer() {
    if (this.timeout_handle) {
      clearTimeout(this.timeout_handle);
      this.timeout_handle = undefined;
    }
  }
}
