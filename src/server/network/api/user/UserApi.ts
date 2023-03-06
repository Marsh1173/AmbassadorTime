import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";
import { RegisterLoggerMsg, RegisterLoggerMsgSchema } from "./RegisterLogger";
import { DeleteLoggerMsg, DeleteLoggerMsgSchema } from "./DeleteLogger";
import { DeleteLogMsg, DeleteLogMsgSchema } from "./DeleteLog";
import { ChangePasswordMsg, ChangePasswordMsgSchema } from "./ChangePassword";
import { CreateLogMsg, CreateLogMsgSchema } from "./CreateLog";
import { FetchActionLogMsg, FetchActionLogMsgSchema } from "./FetchActionLog";
import { FetchAllLogsMsg, FetchAllLogsMsgSchema } from "./FetchAllLogs";
import { FetchUserLogsMsg, FetchUserLogsMsgSchema } from "./FetchUserLogs";
import { FetchUsersMsg, FetchUsersMsgSchema } from "./FetchUsers";

export interface ClientUserMessage extends MessageInterface {
  type: "ClientUserMessage";
  msg:
    | RegisterLoggerMsg
    | DeleteLoggerMsg
    | DeleteLogMsg
    | ChangePasswordMsg
    | CreateLogMsg
    | FetchActionLogMsg
    | FetchAllLogsMsg
    | FetchUserLogsMsg
    | FetchUsersMsg;
}

export const ClientUserSchema: BaseSchema = {
  type: "ClientUserMessage",
  msg: [
    RegisterLoggerMsgSchema,
    DeleteLoggerMsgSchema,
    DeleteLogMsgSchema,
    ChangePasswordMsgSchema,
    CreateLogMsgSchema,
    FetchActionLogMsgSchema,
    FetchAllLogsMsgSchema,
    FetchUserLogsMsgSchema,
    FetchUsersMsgSchema,
  ],
};
