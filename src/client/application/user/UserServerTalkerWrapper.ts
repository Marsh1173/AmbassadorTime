import { ServerMessage, ServerMessageNotImplemented } from "../../network/api/ClientApi";
import { ServerTalkerWrapper } from "../../network/ServerTalkerWrapper";

export abstract class UserServerTalkerWrapper extends ServerTalkerWrapper {
  public receive_message(msg: ServerMessage): void {
    if (msg.type !== "ServerUserMessage") {
      return;
    }

    switch (msg.msg.type) {
      case "FailureMsg":
        this.handle_failure_msg(msg.msg);
        break;
      case "SuccessMsg":
        this.handle_success_msg(msg.msg);
        break;
      default:
        throw new ServerMessageNotImplemented(msg);
    }
  }

  public send_attempt_change_password(new_password: string) {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "ChangePasswordMsg",
        new_password,
      },
    });
  }
}
