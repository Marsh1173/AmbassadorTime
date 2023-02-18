import { FailureMsg } from "../Failure";
import { SuccessfulLoginMsg } from "./SuccessfulLogin";

export interface ServerAuthenticationMessage {
  type: "ServerAuthenticationMessage";
  msg: FailureMsg | SuccessfulLoginMsg;
}
