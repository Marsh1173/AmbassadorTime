import React from "react";
import { Component } from "react";
import { LogData } from "../../../../../model/db/LogModel";
import { UserData, UserPerms } from "../../../../../model/db/UserModel";
import { IClientApp } from "../../../ClientApp";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";
import { LoggerServerTalkerWrapper } from "../../logger/LoggerServerTalkerWrapper";
import { CreateLogModal } from "./CreateLogModal";

export interface LogsViewProps {
  logs: LogData[] | undefined;
  user_data: UserData;
  perms:
    | { is_admin: false; stw: LoggerServerTalkerWrapper }
    | { is_admin: true; stw: AdminServerTalkerWrapper };
  client_app: IClientApp;
}

export class LogsView extends Component<
  { props: LogsViewProps; children?: JSX.Element[] },
  {}
> {
  constructor(props: { props: LogsViewProps; children: JSX.Element[] }) {
    super(props);
  }

  public render() {
    let logs_element: JSX.Element;
    if (this.props.props.logs === undefined) {
      logs_element = <span className="loading">Loading...</span>;
    } else {
      logs_element = (
        <div className="logs-container">
          {this.props.props.logs.map((log) => {
            return <span>{log.short_description}</span>;
          })}
        </div>
      );
    }

    return (
      <div className="LogsView">
        {this.props.children}
        {logs_element}
      </div>
    );
  }
}
