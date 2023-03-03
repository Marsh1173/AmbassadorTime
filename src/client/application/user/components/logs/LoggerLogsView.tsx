import React from "react";
import { Component } from "react";
import { LoggerServerTalkerWrapper } from "../../logger/LoggerServerTalkerWrapper";
import { CreateLogModal } from "./CreateLogModal";
import { LogsView, LogsViewProps } from "./LogsView";

export interface LoggerLogsViewProps extends LogsViewProps {
  stw: LoggerServerTalkerWrapper;
}

export class LoggerLogsView extends Component<LoggerLogsViewProps, {}> {
  private readonly create_log_modal_ref: React.RefObject<CreateLogModal> =
    React.createRef();

  render() {
    return (
      <LogsView props={this.props}>
        <button
          onClick={() => {
            this.create_log_modal_ref.current?.show();
          }}
        >
          Log Time
        </button>
        <CreateLogModal
          ref={this.create_log_modal_ref}
          on_confirm={() => {
            this.props.stw.send_attempt_create_log();
          }}
          client_app={this.props.client_app}
          user_data={this.props.user_data}
        ></CreateLogModal>
      </LogsView>
    );
  }
}
