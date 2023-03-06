import { LogModel } from "../../../../model/db/LogModel";

export interface LogBatchMsg {
  type: "LogBatchMsg";
  logs: LogModel[];
}
