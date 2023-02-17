import { ServerTalkerWrapper } from "../../network/ServerTalkerWrapper";

export class AuthenticatorServerTalkerWrapper extends ServerTalkerWrapper {
  public receive_message(msg: any): void {
    throw new Error("Method not implemented.");
  }
  public on_server_talker_close(): void {
    throw new Error("Method not implemented.");
  }
}
