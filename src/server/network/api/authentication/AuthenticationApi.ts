import { MessageInterface } from "../utils/MessageInterface";
import { BaseSchema } from "../utils/Schema";
import { AttemptLoginMsg, AttemptLoginMsgSchema } from "./AttemptLogin";

export interface ClientAuthenticationMessage extends MessageInterface {
  type: "ClientAuthenticationMessage";
  msg: AttemptLoginMsg;
}

export const ClientAuthenticationSchema: BaseSchema = {
  type: "ClientAuthenticationMessage",
  msg: [AttemptLoginMsgSchema],
};
