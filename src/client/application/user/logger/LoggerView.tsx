import React from "react";
import { LogModel } from "../../../../model/db/LogModel";
import { UserModel } from "../../../../model/db/UserModel";
import { ChangePasswordModal } from "../components/profile/ChangePasswordModal";
import { LeftNavProps } from "../components/base/LeftNav";
import { LogsView } from "../components/logs/LogsView";
import { UserDetailView } from "../components/users/UserDetailView";
import { UserView, UserViewProps, UserViewState } from "../UserView";
import { LoggerServerTalkerWrapper } from "./LoggerServerTalkerWrapper";

export const logger_view_types = ["logs", "profile"] as const;
export type LoggerViewType = typeof logger_view_types[number];

export type LoggerViewProps = UserViewProps;
export interface LoggerViewState extends UserViewState<LoggerViewType> {}

const button_labels: Record<LoggerViewType, string> = {
  logs: "Time Logs",
  profile: "Profile",
};

export class LoggerView extends UserView<
  LoggerViewType,
  LoggerViewProps,
  LoggerViewState
> {
  protected readonly stw: LoggerServerTalkerWrapper;
  private readonly change_password_ref: React.RefObject<ChangePasswordModal> =
    React.createRef();

  constructor(props: { props: LoggerViewProps }) {
    super(props, { view: "logs", logs: undefined });
    this.stw = new LoggerServerTalkerWrapper(
      props.props.server_talker,
      props.props.client_app,
      this
    );
  }

  protected get_main_content(): JSX.Element {
    return (
      <>
        {this.state.view === "logs" && (
          <LogsView
            logs={this.state.logs}
            perms={{ is_admin: false, stw: this.stw }}
            client_app={this.props.props.client_app}
            user_data={this.props.props.user_data}
          ></LogsView>
        )}
        {this.state.view === "profile" && (
          <UserDetailView
            user_data={UserModel.FillTotalTime(
              this.props.props.user_data,
              this.state.logs ?? [],
              new Date().getMonth()
            )}
            logs={this.state.logs ? this.state.logs : []}
          >
            <hr />
            <button
              className="change-password"
              onClick={() => this.change_password_ref.current?.show()}
            >
              Change Password
            </button>
            <ChangePasswordModal
              ref={this.change_password_ref}
              client_app={this.props.props.client_app}
              logger_stw={this.stw}
            ></ChangePasswordModal>
          </UserDetailView>
        )}
      </>
    );
  }

  protected get_left_nav_buttons(): LeftNavProps {
    return {
      options: logger_view_types.map((view_type) => {
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

  protected attempt_load_content(view: LoggerViewType) {
    if (view === "logs" && this.state.logs === undefined) {
      this.stw.request_fetch_logs();
    } else if (view === "profile" && this.state.logs === undefined) {
      this.stw.request_fetch_logs();
    }
  }

  public update_logs_list(logs: LogModel[]) {
    this.setState({ logs });
  }
}
