import {
  ClientAuthenticationSchema,
  ClientAuthenticationMessage,
} from "./authentication/AuthenticationApi";
import { OptionSchema } from "./utils/Schema";

export type ClientMessage = ClientAuthenticationMessage;

export const ServerApiSchema: OptionSchema = [ClientAuthenticationSchema];
