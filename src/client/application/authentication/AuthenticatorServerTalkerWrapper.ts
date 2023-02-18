import { UserData } from "../../../model/db/UserModel";
import { ServerMessage, ServerMessageNotImplemented } from "../../network/api/ClientApi";
import { IServerTalker } from "../../network/ServerTalker";
import { ServerTalkerWrapper } from "../../network/ServerTalkerWrapper";
import { IClientApp } from "../ClientApp";
import { AuthenticationView } from "./AuthenticationView";

export class AuthenticatorServerTalkerWrapper extends ServerTalkerWrapper {
  constructor(server_talker: IServerTalker, client_app: IClientApp, private readonly view: AuthenticationView) {
    super(server_talker, client_app);
  }

  public receive_message(msg: ServerMessage): void {
    if (msg.type !== "ServerAuthenticationMessage") {
      return;
    }

    switch (msg.msg.type) {
      case "SuccessfulLoginMsg":
        this.on_successful_login(msg.msg.user_data);
        break;
      case "FailureMsg":
        this.view.set_submitted(false);
        this.handle_failure_msg(msg.msg);
        break;
      default:
        throw new ServerMessageNotImplemented(msg);
    }
  }

  private on_successful_login(user_data: UserData) {
    this.view.on_successful_login(user_data);
  }

  public send_login(username: string, password: string) {
    this.send({
      type: "ClientAuthenticationMessage",
      msg: {
        type: "AttemptLoginMsg",
        user_id: username,
        password: password,
      },
    });
  }
}
