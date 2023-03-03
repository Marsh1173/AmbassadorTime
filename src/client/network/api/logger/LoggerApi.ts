import { LogBatchMsg } from "../user/LogBatch";

export interface ServerLoggerMessage {
  type: "ServerLoggerMessage";
  msg: LogBatchMsg;
}
