import { BufferedMessageReceiver } from "../../model/utils/BufferedMessageReceiver";
import { Id } from "../../model/utils/Id";
import { ClientMessage } from "../../server/network/api/ServerApi";
import { ClientConfig } from "../utils/ClientConfig";
import { ServerMessage } from "./api/ClientApi";
import { IServerTalkerWrapper } from "./ServerTalkerWrapper";

export interface IServerTalker {
  send: (msg: ClientMessage) => void;
  close: () => void;
  add_observer: (new_observer: IServerTalkerWrapper) => void;
  remove_observer: (id: Id) => void;
}

export class ServerTalker
  extends BufferedMessageReceiver<IServerTalkerWrapper, string>
  implements IServerTalker
{
  private wss: WebSocket;

  constructor(
    private readonly config: ClientConfig,
    private readonly on_open: (server_talker: IServerTalker) => void
  ) {
    super();
    this.wss = this.open_websocket();
  }

  private open_websocket(): WebSocket {
    let wss: WebSocket = new WebSocket(this.config.url);

    wss.onclose = (ev: CloseEvent) => {
      this.on_unable_to_connect();
    };

    wss.onopen = () => {
      console.log("Websocket connection succeeded");

      wss.onclose = (ev: CloseEvent) => {
        this.on_close();
      };

      wss.onerror = (error) => {
        console.error("WebSocket error:");
        console.error(error);
      };

      wss.onmessage = (msg: MessageEvent) => {
        try {
          this.on_receive_message(msg.data);
        } catch (err) {
          console.error(err);
        }
      };

      this.on_open(this);
      wss.onopen = () => {};
    };

    return wss;
  }

  public close() {
    this.wss.close();
  }

  private on_close() {
    console.error("Websocket connection closed");
    this.observers.forEach((observer) => {
      observer.on_server_talker_close(
        "You have been disconnected. Try refreshing."
      );
    });

    this.wss.onerror = () => {};
  }

  private on_unable_to_connect() {
    this.observers.forEach((observer) => {
      observer.on_server_talker_close("Could not connect.");
    });
  }

  /* MESSAGE SENDING */
  public send(msg: ClientMessage) {
    if (this.wss.readyState === this.wss.OPEN) {
      let string;
      this.wss.send(JSON.stringify(msg));
    } else {
      console.error("ERROR: TRIED TO SEND TO A CLOSED WEBSOCKET");
    }
  }

  /* MESSAGE RECEIVING (mostly implemented in the BufferedMessageReceiver class) */
  protected send_message_to_observers(
    observers: IServerTalkerWrapper[],
    msg: string
  ): void {
    let server_msg: ServerMessage = JSON.parse(msg) as ServerMessage;
    observers.forEach((observer) => {
      observer.receive_message(server_msg);
    });
  }
}
