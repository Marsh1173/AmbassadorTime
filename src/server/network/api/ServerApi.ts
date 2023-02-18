import {
  ClientAuthenticationSchema,
  ClientAuthenticationMessage,
} from "./authentication/AuthenticationApi";
import { ClientUserMessage, ClientUserSchema } from "./user/UserApi";
import { OptionSchema } from "./utils/parsing/Schema";

export class ClientMessageNotImplemented extends Error {
  constructor(client_msg: any) {
    super("Client message not implemented yet: " + client_msg.toString());
  }
}

export type ClientMessage = ClientAuthenticationMessage | ClientUserMessage;

export const ServerApiSchema: OptionSchema = [
  ClientAuthenticationSchema,
  ClientUserSchema,
];
