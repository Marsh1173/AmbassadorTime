import { UserData, UserId } from "../../../model/db/UserModel";
import { FetchLoggersSuccess } from "../../database/users/UserDao";
import { ActionLogService } from "../../logging/ActionLogService";
import { ClientMessage, ClientMessageNotImplemented } from "../../network/api/ServerApi";
import { FetchActionLogMsg } from "../../network/api/user/FetchActionLog";
import { IClient } from "../../network/client/Client";
import { ClientWrapper } from "../../network/client/ClientWrapper";
import { FailureMsg } from "../../utils/ReturnMsg";
import { IUserService } from "../UserService";
import { UserClientMap } from "./UserClientMap";

export class UserClientWrapper extends ClientWrapper {
  constructor(
    private readonly user_service: IUserService,
    client: IClient,
    client_map: UserClientMap,
    public readonly user_data: UserData
  ) {
    super(client, client_map);
  }

  public receive_message(msg: ClientMessage, client_id: string): void {
    if (msg.type !== "ClientUserMessage") {
      return;
    }

    switch (msg.msg.type) {
      case "ChangePasswordMsg":
        this.communicate_success_or_failure_action(
          this.user_service.change_password_service.attempt_change_password(this.user_data, msg.msg.new_password)
        );
        break;
      case "FetchLoggers":
        this.attempt_fetch_loggers();
        break;
      case "FetchActionLogMsg":
        this.attempt_fetch_action_logs(msg.msg);
        break;
      default:
        throw new ClientMessageNotImplemented(msg);
    }
  }

  public on_client_close(id: UserId): void {
    super.on_client_close(id);
    this.user_service.server_app.auth_service.authenticated_client_tracker.disconnect_authenticated_client(
      this.user_data.id
    );
  }

  protected log_disconnection(): void {
    console.log("Disconnected from authenticated client " + this.user_data.displayname);
  }

  protected attempt_fetch_loggers() {
    let results: FetchLoggersSuccess | FailureMsg = this.user_service.fetch_loggers_service.fetch_loggers(
      this.user_data
    );
    if (results.success) {
      this.send({
        type: "ServerAdminMessage",
        msg: {
          type: "AllLoggersMsg",
          users: results.users,
        },
      });
    } else {
      this.communicate_success_or_failure_action(results);
    }
  }

  protected attempt_fetch_action_logs(msg: FetchActionLogMsg) {
    if (!this.user_data.is_admin) {
      this.send({
        type: "ServerUserMessage",
        msg: {
          type: "FailureMsg",
          msg: "You don't have permission to do that.",
        },
      });
    } else {
      ActionLogService.get_log_file_str(msg.year, msg.month, (val: string | undefined) => {
        this.send({
          type: "ServerAdminMessage",
          msg: {
            type: "MonthActionsMsg",
            data: val,
            year: msg.year,
            month: msg.month,
          },
        });
      });
    }
  }
}
