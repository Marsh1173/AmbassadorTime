import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";
import { RegisterLoggerMsg, RegisterLoggerMsgSchema } from "./RegisterLogger";
import { DeleteLoggerMsg, DeleteLoggerMsgSchema } from "./DeleteLogger";
import { PromoteLoggerMsg, PromoteLoggerMsgSchema } from "./PromoteLogger";
import { DemoteLoggerAdminMsg, DemoteLoggerAdminMsgSchema } from "./DemoteLoggerAdmin";
import { ChangePasswordMsg, ChangePasswordMsgSchema } from "./ChangePassword";
import { CreateLogMsg, CreateLogMsgSchema } from "./CreateLog";
import { FetchActionLogMsg, FetchActionLogMsgSchema } from "./FetchActionLog";
import { FetchAllLogsMsg, FetchAllLogsMsgSchema } from "./FetchAllLogs";
import { FetchUserLogsMsg, FetchUserLogsMsgSchema } from "./FetchUserLogs";

export interface ClientUserMessage extends MessageInterface {
  type: "ClientUserMessage";
  msg:
    | RegisterLoggerMsg
    | DeleteLoggerMsg
    | PromoteLoggerMsg
    | DemoteLoggerAdminMsg
    | ChangePasswordMsg
    | CreateLogMsg
    | FetchActionLogMsg
    | FetchAllLogsMsg
    | FetchUserLogsMsg;
}

export const ClientUserSchema: BaseSchema = {
  type: "ClientUserMessage",
  msg: [
    RegisterLoggerMsgSchema,
    DeleteLoggerMsgSchema,
    PromoteLoggerMsgSchema,
    DemoteLoggerAdminMsgSchema,
    ChangePasswordMsgSchema,
    CreateLogMsgSchema,
    FetchActionLogMsgSchema,
    FetchAllLogsMsgSchema,
    FetchUserLogsMsgSchema,
  ],
};
