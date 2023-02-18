import { ServerAdminMessage } from "./admin/AdminApi.ts";
import { ServerAuthenticationMessage } from "./authentication/AuthenticationApi";
import { ServerLoggerMessage } from "./logger/LoggerApi";

export class ServerMessageNotImplemented extends Error {
  constructor(server_msg: any) {
    console.log(server_msg);
    super("Server message not implemented yet.");
  }
}

export type ServerMessage = ServerAuthenticationMessage | ServerAdminMessage | ServerLoggerMessage;
