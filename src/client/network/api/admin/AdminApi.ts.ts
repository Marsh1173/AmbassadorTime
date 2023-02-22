import { FailureMsg } from "../Failure";
import { LogBatchMsg } from "../user/LogBatch";
import { SuccessMsg } from "../user/Success";
import { AllLoggersMsg } from "./AllLoggers";
import { MonthActionsMsg } from "./MonthActions";

export interface ServerAdminMessage {
  type: "ServerAdminMessage";
  msg: LogBatchMsg | AllLoggersMsg | MonthActionsMsg;
}
