import { FailureMsg } from "../Failure";
import { LogBatchMsg } from "../user/LogBatch";
import { SuccessMsg } from "../user/Success";

export interface ServerLoggerMessage {
  type: "ServerLoggerMessage";
  msg: LogBatchMsg;
}
