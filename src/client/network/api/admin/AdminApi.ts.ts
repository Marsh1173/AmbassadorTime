import { FailureMsg } from "../Failure";
import { LogBatchMsg } from "../user/LogBatch";
import { SuccessMsg } from "../user/Success";
import { AllUsersMsg } from "./AllUsers";
import { MonthActionsMsg } from "./MonthActions";

export interface ServerAdminMessage {
  type: "ServerAdminMessage";
  msg: LogBatchMsg | AllUsersMsg | MonthActionsMsg;
}
