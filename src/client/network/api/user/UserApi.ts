import { FailureMsg } from "../Failure";
import { SuccessMsg } from "../user/Success";

export interface ServerUserMessage {
  type: "ServerUserMessage";
  msg: FailureMsg | SuccessMsg;
}
