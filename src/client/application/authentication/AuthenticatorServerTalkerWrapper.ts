import { ServerTalkerWrapper } from "../../network/ServerTalkerWrapper";

export class AuthenticatorServerTalkerWrapper extends ServerTalkerWrapper {
  public receive_message(msg: any): void {
    console.log(msg);
  }
}
