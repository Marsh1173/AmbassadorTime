import React from "react";
import { Component } from "react";
import { LogModel } from "../../../../../model/db/LogModel";
import { UserData } from "../../../../../model/db/UserModel";
import { ATTime } from "../../../../../model/utils/ATDate";
import { IClientApp } from "../../../ClientApp";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";
import { LoggerServerTalkerWrapper } from "../../logger/LoggerServerTalkerWrapper";
import { CreateLogModal } from "./CreateLogModal";
import { ViewLogModal } from "./ViewLogModal";

export interface LogsViewProps {
  logs: LogModel[] | undefined;
  user_data: UserData;
  perms:
    | { is_admin: false; stw: LoggerServerTalkerWrapper }
    | { is_admin: true; stw: AdminServerTalkerWrapper };
  client_app: IClientApp;
}

export interface LogsViewState {}

export class LogsView extends Component<LogsViewProps, LogsViewState> {
  private readonly log_view_modal_ref: React.RefObject<ViewLogModal> =
    React.createRef();
  private readonly create_log_modal_ref: React.RefObject<CreateLogModal> =
    React.createRef();
  constructor(props: LogsViewProps) {
    super(props);

    this.open_log = this.open_log.bind(this);
    this.attempt_create_log = this.attempt_create_log.bind(this);
  }

  public render() {
    let logs_element: JSX.Element;
    if (this.props.logs === undefined) {
      logs_element = <span className="loading">Loading...</span>;
    } else {
      logs_element = (
        <div className="table-container">
          <table className="logs_table">
            <thead>
              <tr>
                {this.props.perms.is_admin && <th className="user">User</th>}
                <th className="description">Description</th>
                <th className="date">Date</th>
                <th className="hours">Hours</th>
              </tr>
            </thead>
            <tbody>
              {this.props.logs.map((log_data) => {
                return (
                  <tr key={log_data.id} onClick={() => this.open_log(log_data)}>
                    {this.props.perms.is_admin && (
                      <td className="user">{log_data.user_id}</td>
                    )}
                    <td className="description">
                      {log_data.short_description}
                    </td>
                    <td className="date">
                      {ATTime.get_date_from_ms(log_data.target_date_time_ms)}
                    </td>
                    <td className="hours">
                      {ATTime.get_hours_and_minutes_from_minutes(
                        log_data.minutes_logged
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="LogsView">
        {!this.props.perms.is_admin && (
          <button
            className="open-create-log-modal"
            onClick={() => {
              if (this.create_log_modal_ref.current) {
                this.create_log_modal_ref.current.show();
              }
            }}
          >
            Log Here
          </button>
        )}
        <span className="info">Click on a row to see more.</span>
        {logs_element}
        <ViewLogModal
          perms={this.props.perms}
          ref={this.log_view_modal_ref}
        ></ViewLogModal>
        {this.props.perms.is_admin === false && (
          <CreateLogModal
            ref={this.create_log_modal_ref}
            client_app={this.props.client_app}
            on_confirm={this.attempt_create_log}
          ></CreateLogModal>
        )}
      </div>
    );
  }

  private open_log(log_data: LogModel) {
    if (this.log_view_modal_ref.current) {
      this.log_view_modal_ref.current.show(log_data);
    }
  }

  private attempt_create_log(
    short_description: string,
    target_date_time_ms: number,
    minutes_logged: number
  ) {
    if (!this.props.perms.is_admin) {
      this.props.perms.stw.send_attempt_create_log(
        short_description,
        target_date_time_ms,
        minutes_logged
      );
    }
  }
}
