import React from "react";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { LeftNavProps } from "../components/LeftNav";
import { LogsView } from "../components/logs/LogsView";
import { UserView, UserViewProps, UserViewState } from "../UserView";
import { LoggerServerTalkerWrapper } from "./LoggerServerTalkerWrapper";

export const logger_view_types = ["logs", "change_password"] as const;
export type LoggerViewType = typeof logger_view_types[number];

export type LoggerViewProps = UserViewProps;
export interface LoggerViewState extends UserViewState<LoggerViewType> {}

const button_labels: Record<LoggerViewType, string> = {
  logs: "Time Logs",
  change_password: "Change Password",
};

export class LoggerView extends UserView<
  LoggerViewType,
  LoggerViewProps,
  LoggerViewState
> {
  protected readonly stw: LoggerServerTalkerWrapper;

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
        {this.state.view === "change_password" && (
          <ChangePasswordForm
            client_app={this.props.props.client_app}
            on_submit={(new_password) => {
              this.stw.send_attempt_change_password(new_password);
            }}
          ></ChangePasswordForm>
        )}
        {this.state.view === "logs" && (
          <LogsView
            props={{
              logs: this.state.logs,
              perms: { is_admin: false, stw: this.stw },
              client_app: this.props.props.client_app,
              user_data: this.props.props.user_data,
            }}
          ></LogsView>
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
    //TODO
  }
}
