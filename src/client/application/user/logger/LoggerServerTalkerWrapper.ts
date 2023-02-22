import { ServerMessage, ServerMessageNotImplemented } from "../../../network/api/ClientApi";
import { IServerTalker } from "../../../network/ServerTalker";
import { IClientApp } from "../../ClientApp";
import { UserServerTalkerWrapper } from "../UserServerTalkerWrapper";
import { LoggerView } from "./LoggerView";

export class LoggerServerTalkerWrapper extends UserServerTalkerWrapper {
  constructor(server_talker: IServerTalker, client_app: IClientApp, private readonly view: LoggerView) {
    super(server_talker, client_app);
  }

  public receive_message(msg: ServerMessage): void {
    if (msg.type !== "ServerLoggerMessage") {
      return super.receive_message(msg);
    }

    switch (msg.msg.type) {
      default:
        throw new ServerMessageNotImplemented(msg);
    }
  }
}
