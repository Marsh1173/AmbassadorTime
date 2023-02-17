import { SuccessfulLogin } from "./SuccessfulLogin";
import { UnsuccessfulLogin } from "./UnsuccessfuLogin";

export interface ServerAuthenticationMessage {
  type: "ServerAuthenticationMessage";
  msg: UnsuccessfulLogin | SuccessfulLogin;
}
