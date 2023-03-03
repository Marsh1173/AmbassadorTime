import { LogData } from "../../../../model/db/LogModel";

export interface LogBatchMsg {
  type: "LogBatchMsg";
  logs: LogData[];
}
