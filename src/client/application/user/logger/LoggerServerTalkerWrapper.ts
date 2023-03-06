import {
  ServerMessage,
  ServerMessageNotImplemented,
} from "../../../network/api/ClientApi";
import { IServerTalker } from "../../../network/ServerTalker";
import { IClientApp } from "../../ClientApp";
import { UserServerTalkerWrapper } from "../UserServerTalkerWrapper";
import { LoggerView } from "./LoggerView";

export class LoggerServerTalkerWrapper extends UserServerTalkerWrapper {
  constructor(
    server_talker: IServerTalker,
    client_app: IClientApp,
    private readonly view: LoggerView
  ) {
    super(server_talker, client_app);
  }

  public receive_message(msg: ServerMessage): void {
    if (msg.type !== "ServerLoggerMessage") {
      return super.receive_message(msg);
    }

    switch (msg.msg.type) {
      case "LogBatchMsg":
        this.view.update_logs_list(msg.msg.logs);
        break;
      default:
        throw new ServerMessageNotImplemented(msg);
    }
  }

  public request_fetch_logs() {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "FetchUserLogs",
      },
    });
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

  public send_attempt_create_log(
    short_description: string,
    target_date_time_ms: number,
    minutes_logged: number
  ) {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "CreateLogMsg",
        short_description,
        target_date_time_ms,
        minutes_logged,
      },
    });
    this.request_fetch_logs();
  }
}
