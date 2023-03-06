import React from "react";
import { UserData, UserTimeData } from "../../../../model/db/UserModel";
import { LeftNavProps } from "../components/LeftNav";
import { UsersView } from "../components/users/UsersView";
import { UserView, UserViewProps, UserViewState } from "../UserView";
import { AdminServerTalkerWrapper } from "./AdminServerTalkerWrapper";
import { ActionHistoryView } from "../components/ActionHistoryView";
import { LogsView } from "../components/logs/LogsView";
import { LogModel } from "../../../../model/db/LogModel";

export const admin_view_types = ["logs", "users", "action_logs"] as const;
export type AdminViewType = typeof admin_view_types[number];
const INITIAL_VIEW: AdminViewType = "logs";

export type AdminViewProps = UserViewProps;
export interface AdminViewState extends UserViewState<AdminViewType> {
  users: UserTimeData[] | undefined;
}

const button_labels: Record<AdminViewType, string> = {
  action_logs: "Action History",
  users: "Users",
  logs: "Time Logs",
};

export class AdminView extends UserView<
  AdminViewType,
  AdminViewProps,
  AdminViewState
> {
  public readonly action_log_view_ref: React.RefObject<ActionHistoryView> =
    React.createRef();

  protected readonly stw: AdminServerTalkerWrapper;
  constructor(props: { props: AdminViewProps }) {
    super(props, { view: INITIAL_VIEW, users: undefined, logs: undefined });

    this.stw = new AdminServerTalkerWrapper(
      props.props.server_talker,
      props.props.client_app,
      this
    );

    this.update_users_list = this.update_users_list.bind(this);
    this.update_user_times = this.update_user_times.bind(this);
  }

  protected get_main_content() {
    return (
      <>
        {this.state.view === "users" && (
          <UsersView
            client_app={this.props.props.client_app}
            admin_stw={this.stw}
            users={this.state.users}
          ></UsersView>
        )}
        {this.state.view === "action_logs" && (
          <ActionHistoryView
            ref={this.action_log_view_ref}
            admin_stw={this.stw}
          ></ActionHistoryView>
        )}
        {this.state.view === "logs" && (
          <LogsView
            logs={this.state.logs}
            perms={{ is_admin: true, stw: this.stw }}
            client_app={this.props.props.client_app}
            user_data={this.props.props.user_data}
          ></LogsView>
        )}
      </>
    );
  }

  protected get_left_nav_buttons(): LeftNavProps {
    return {
      options: admin_view_types.map((view_type) => {
        return {
          name: button_labels[view_type],
          action: () => {
            this.change_view(view_type);
          },
          selected: this.state.view === view_type,
        };
      }),
    };
  }

  public update_users_list(new_users: UserData[]) {
    this.setState(
      {
        users: new_users.map((user) => {
          return { ...user, time: 0 };
        }),
      },
      () => {
        this.update_user_times();
      }
    );
  }

  public update_logs_list(logs: LogModel[]): void {
    this.setState({ logs }, () => {
      this.update_user_times();
    });
  }

  protected update_user_times() {
    if (this.state.logs !== undefined && this.state.users !== undefined) {
      let logs = this.state.logs;
      let users = this.state.users;
      let hour_users: UserTimeData[] = users.map((user) => {
        return {
          ...user,
          time: logs
            .filter((log) => log.user_id === user.id)
            .reduce((sum, log) => sum + log.minutes_logged, 0),
        };
      });

      this.setState({ users: hour_users });
    }
  }

  protected attempt_load_content(view: AdminViewType) {
    if (view === "users" && this.state.users === undefined) {
      this.stw.request_fetch_logs();
      this.stw.request_fetch_users();
    } else if (view === "logs" && this.state.logs === undefined) {
      this.stw.request_fetch_logs();
    }
  }
}
