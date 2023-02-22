import React from "react";
import { Component } from "react";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { LeftNav, LeftNavProps } from "../components/LeftNav";
import { UserHeader } from "../components/UserHeader";
import { UserViewProps } from "../UserView";
import { LoggerServerTalkerWrapper } from "./LoggerServerTalkerWrapper";

export const logger_view_types = ["logs", "change_password"] as const;
export type LoggerViewType = typeof logger_view_types[number];

export type LoggerViewProps = UserViewProps;
export interface LoggerViewState {
  view: LoggerViewType;
}

const button_labels: Record<LoggerViewType, string> = {
  logs: "Time Logs",
  change_password: "Change Password",
};

export class LoggerView extends Component<{ props: LoggerViewProps }, LoggerViewState> {
  private readonly logger_stw: LoggerServerTalkerWrapper;

  constructor(props: { props: LoggerViewProps }) {
    super(props);

    this.state = { view: "logs" };
    this.logger_stw = new LoggerServerTalkerWrapper(this.props.props.server_talker, this.props.props.client_app, this);

    this.change_view = this.change_view.bind(this);
  }

  public render() {
    let button_options: LeftNavProps = {
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

    return (
      <div className="LoggerView">
        <UserHeader></UserHeader>
        <div className="page-content">
          <LeftNav options={button_options.options}></LeftNav>
          <div className="main-content">
            {this.state.view === "change_password" && (
              <ChangePasswordForm
                client_app={this.props.props.client_app}
                on_submit={(new_password) => {
                  this.logger_stw.send_attempt_change_password(new_password);
                }}
              ></ChangePasswordForm>
            )}
          </div>
        </div>
      </div>
    );
  }

  public change_view(new_view: LoggerViewType) {
    this.setState({ view: new_view });
  }
}
