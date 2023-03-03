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
}
