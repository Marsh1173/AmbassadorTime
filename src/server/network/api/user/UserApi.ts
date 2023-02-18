import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";
import { RegisterLoggerMsg, RegisterLoggerMsgSchema } from "./RegisterLogger";
import { DeleteLoggerMsg, DeleteLoggerMsgSchema } from "./DeleteLogger";
import { PromoteLoggerMsg, PromoteLoggerMsgSchema } from "./PromoteLogger";
import {
  DemoteLoggerAdminMsg,
  DemoteLoggerAdminMsgSchema,
} from "./DemoteLoggerAdmin";
import { ChangePasswordMsg, ChangePasswordMsgSchema } from "./ChangePassword";

export interface ClientUserMessage extends MessageInterface {
  type: "ClientUserMessage";
  msg:
    | RegisterLoggerMsg
    | DeleteLoggerMsg
    | PromoteLoggerMsg
    | DemoteLoggerAdminMsg
    | ChangePasswordMsg;
}

export const ClientUserSchema: BaseSchema = {
  type: "ClientUserMessage",
  msg: [
    RegisterLoggerMsgSchema,
    DeleteLoggerMsgSchema,
    PromoteLoggerMsgSchema,
    DemoteLoggerAdminMsgSchema,
    ChangePasswordMsgSchema,
  ],
};
