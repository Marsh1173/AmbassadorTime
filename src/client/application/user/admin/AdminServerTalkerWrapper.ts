import { LogId } from "../../../../model/db/LogModel";
import { UserData } from "../../../../model/db/UserModel";
import {
  ServerMessage,
  ServerMessageNotImplemented,
} from "../../../network/api/ClientApi";
import { IServerTalker } from "../../../network/ServerTalker";
import { IClientApp } from "../../ClientApp";
import { UserServerTalkerWrapper } from "../UserServerTalkerWrapper";
import { AdminView } from "./AdminView";

export class AdminServerTalkerWrapper extends UserServerTalkerWrapper {
  constructor(
    server_talker: IServerTalker,
    client_app: IClientApp,
    private readonly view: AdminView
  ) {
    super(server_talker, client_app);
  }

  public receive_message(msg: ServerMessage): void {
    if (msg.type !== "ServerAdminMessage") {
      return super.receive_message(msg);
    }

    switch (msg.msg.type) {
      case "AllUsersMsg":
        this.view.update_users_list(msg.msg.users);
        break;
      case "MonthActionsMsg":
        this.view.action_log_view_ref.current?.update_action_log(
          msg.msg.month,
          msg.msg.year,
          msg.msg.data
        );
        break;
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
        type: "FetchAllLogs",
      },
    });
  }

  public request_fetch_users() {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "FetchUsers",
      },
    });
  }

  public request_fetch_action_logs(month: number, year: number) {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "FetchActionLogMsg",
        month,
        year,
      },
    });
  }

  public attempt_create_user(display_name: string, user_id: string) {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "RegisterLoggerMsg",
        user_id,
        display_name,
      },
    });
    this.request_fetch_users();
  }

  public attempt_delete_user(user_id_to_delete: string, password: string) {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "DeleteLoggerMsg",
        user_id_to_delete,
        password,
      },
    });
    this.request_fetch_users();
    this.request_fetch_logs();
  }

  public attempt_delete_log(log_id_to_delete: LogId) {
    this.send({
      type: "ClientUserMessage",
      msg: {
        type: "DeleteLogMsg",
        log_id_to_delete,
      },
    });
    this.request_fetch_logs();
  }
}
