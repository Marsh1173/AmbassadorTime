import { ServerAuthenticationMessage } from "./authentication/AuthenticationApi";

export class ServerMessageNotImplemented extends Error {
  constructor(server_msg: any) {
    super("Server message not implemented yet: " + server_msg.toString());
  }
}

export type ServerMessage = ServerAuthenticationMessage;
