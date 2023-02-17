import {
  ClientAuthenticationSchema,
  ClientAuthenticationMessage,
} from "./authentication/AuthenticationApi";
import { OptionSchema } from "./utils/Schema";

export class ClientMessageNotImplemented extends Error {
  constructor(client_msg: any) {
    super("Client message not implemented yet: " + client_msg.toString());
  }
}

export type ClientMessage = ClientAuthenticationMessage;

export const ServerApiSchema: OptionSchema = [ClientAuthenticationSchema];
