import { UserData, UserId, UserPerms } from "../../../model/db/UserModel";
import { FetchLogsSuccess, LogModelSuccess } from "../../database/logs/LogDao";
import { FetchUsersSuccess } from "../../database/users/UserDao";
import { ActionLogService } from "../../logging/ActionLogService";
import {
  ClientMessage,
  ClientMessageNotImplemented,
} from "../../network/api/ServerApi";
import { CreateLogMsg } from "../../network/api/user/CreateLog";
import { DeleteLogMsg } from "../../network/api/user/DeleteLog";
import { DeleteLoggerMsg } from "../../network/api/user/DeleteLogger";
import { FetchActionLogMsg } from "../../network/api/user/FetchActionLog";
import { RegisterLoggerMsg } from "../../network/api/user/RegisterLogger";
import { IClient } from "../../network/client/Client";
import { ClientWrapper } from "../../network/client/ClientWrapper";
import { FailureMsg, ReturnMsg } from "../../utils/ReturnMsg";
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
          this.user_service.change_password_service.attempt_change_password(
            this.user_data,
            msg.msg.new_password
          )
        );
        break;
      case "FetchUsers":
        this.attempt_fetch_users();
        break;
      case "FetchActionLogMsg":
        this.attempt_fetch_action_logs(msg.msg);
        break;
      case "FetchAllLogs":
        this.attempt_fetch_all_logs();
        break;
      case "FetchUserLogs":
        this.attempt_fetch_user_logs();
        break;
      case "RegisterLoggerMsg":
        this.attempt_register_logger(msg.msg);
        break;
      case "DeleteLoggerMsg":
        this.attempt_delete_logger(msg.msg);
        break;
      case "CreateLogMsg":
        this.attempt_create_log(msg.msg);
        break;
      case "DeleteLogMsg":
        this.attempt_delete_log(msg.msg);
        break;
      default:
        throw new ClientMessageNotImplemented(msg);
    }
  }

  public force_close() {
    let client = this.deconstruct();
    client.force_close();
  }

  public on_client_close(id: UserId): void {
    super.on_client_close(id);
    this.user_service.server_app.auth_service.authenticated_client_tracker.disconnect_authenticated_client(
      this.user_data.id
    );
  }

  protected log_disconnection(): void {
    console.log(
      "Disconnected from authenticated client " + this.user_data.displayname
    );
  }

  protected attempt_delete_log(msg: DeleteLogMsg) {
    let results: ReturnMsg =
      this.user_service.delete_log_controller.attempt_delete_log(
        this.user_data,
        msg.log_id_to_delete
      );
    this.communicate_success_or_failure_action(results);
  }

  protected attempt_create_log(msg: CreateLogMsg) {
    let results: FailureMsg | LogModelSuccess =
      this.user_service.create_log_service.attempt_create_log(
        this.user_data,
        msg.short_description,
        msg.target_date_time_ms,
        msg.minutes_logged
      );
    this.communicate_success_or_failure_action(results);
  }

  protected attempt_register_logger(msg: RegisterLoggerMsg) {
    let results: ReturnMsg =
      this.user_service.register_logger_service.attempt_register_logger(
        this.user_data,
        msg.display_name,
        msg.user_id
      );
    this.communicate_success_or_failure_action(results);
  }

  protected attempt_delete_logger(msg: DeleteLoggerMsg) {
    let results: ReturnMsg =
      this.user_service.delete_logger_service.attempt_delete_logger(
        this.user_data,
        msg.user_id_to_delete,
        msg.password
      );
    this.communicate_success_or_failure_action(results);
  }

  protected attempt_fetch_users() {
    let results: FetchUsersSuccess | FailureMsg =
      this.user_service.fetch_users_service.fetch_users(this.user_data);
    if (results.success) {
      this.send({
        type: "ServerAdminMessage",
        msg: {
          type: "AllUsersMsg",
          users: results.users,
        },
      });
    } else {
      this.communicate_success_or_failure_action(results);
    }
  }

  protected attempt_fetch_action_logs(msg: FetchActionLogMsg) {
    if (this.user_data.perms === UserPerms.Admin) {
      ActionLogService.get_log_file_str(
        msg.year,
        msg.month,
        (val: string | undefined) => {
          this.send({
            type: "ServerAdminMessage",
            msg: {
              type: "MonthActionsMsg",
              data: val,
              year: msg.year,
              month: msg.month,
            },
          });
        }
      );
    } else {
      this.send({
        type: "ServerUserMessage",
        msg: {
          type: "FailureMsg",
          msg: "You don't have permission to do that.",
        },
      });
    }
  }

  protected attempt_fetch_all_logs() {
    let results: FetchLogsSuccess | FailureMsg =
      this.user_service.fetch_logs_service.fetch_all_logs(this.user_data);
    if (!results.success) {
      this.communicate_success_or_failure_action(results);
    } else {
      this.send({
        type: "ServerAdminMessage",
        msg: {
          type: "LogBatchMsg",
          logs: results.logs,
        },
      });
    }
  }
  protected attempt_fetch_user_logs() {
    let results: FetchLogsSuccess | FailureMsg =
      this.user_service.fetch_logs_service.fetch_user_logs(this.user_data);
    if (!results.success) {
      this.communicate_success_or_failure_action(results);
    } else {
      this.send({
        type: "ServerLoggerMessage",
        msg: {
          type: "LogBatchMsg",
          logs: results.logs,
        },
      });
    }
  }
}
