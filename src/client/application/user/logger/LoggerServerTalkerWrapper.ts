import { ServerMessage } from "../../../network/api/ClientApi";
import { IServerTalker } from "../../../network/ServerTalker";
import { ServerTalkerWrapper } from "../../../network/ServerTalkerWrapper";
import { IClientApp } from "../../ClientApp";
import { LoggerView } from "./LoggerView";

export class LoggerServerTalkerWrapper extends ServerTalkerWrapper {
  constructor(server_talker: IServerTalker, client_app: IClientApp, private readonly view: LoggerView) {
    super(server_talker, client_app);
  }

  public receive_message(msg: ServerMessage): void {
    // if (msg.type !== "ServerUserMessage") {
    //   return;
    // }

    // switch (msg.msg.type) {
    //   default:
    //     throw new ServerMessageNotImplemented(msg);
    // }
    throw new Error("Method not implemented");
  }
}
