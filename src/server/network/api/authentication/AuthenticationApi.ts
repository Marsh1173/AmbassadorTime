import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";
import { AttemptLoginMsg, AttemptLoginMsgSchema } from "./AttemptLogin";

export interface ClientAuthenticationMessage extends MessageInterface {
  type: "ClientAuthenticationMessage";
  msg: AttemptLoginMsg;
}

export const ClientAuthenticationSchema: BaseSchema = {
  type: "ClientAuthenticationMessage",
  msg: [AttemptLoginMsgSchema],
};
