import { UserData } from "../../../model/db/UserModel";
import {
  ServerMessage,
  ServerMessageNotImplemented,
} from "../../network/api/ClientApi";
import { IServerTalker } from "../../network/ServerTalker";
import { ServerTalkerWrapper } from "../../network/ServerTalkerWrapper";
import { IClientApp } from "../ClientApp";
import { UserView } from "./UserView";

export class UserServerTalkerWrapper extends ServerTalkerWrapper {
  constructor(
    server_talker: IServerTalker,
    client_app: IClientApp,
    private readonly view: UserView
  ) {
    super(server_talker, client_app);
  }

  public receive_message(msg: ServerMessage): void {
    // if (msg.type !== "ServerAuthenticationMessage") {
    //   return;
    // }

    // switch (msg.msg.type) {
    //   default:
    //     throw new ServerMessageNotImplemented(msg);
    // }
    throw new Error("Method not implemented");
  }
}
