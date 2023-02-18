import React from "react";
import { Component } from "react";
import { LeftNav, LeftNavProps } from "../components/LeftNav";
import { UserHeader } from "../components/UserHeader";
import { UserViewProps } from "../UserView";
import { AdminServerTalkerWrapper } from "./AdminServerTalkerWrapper";

export const admin_view_types = ["logs", "users", "action_logs", "change_password"] as const;
export type AdminViewType = typeof admin_view_types[number];

export type AdminViewProps = UserViewProps;
export interface AdminViewState {
  view: AdminViewType;
}

const button_labels: Record<AdminViewType, string> = {
  action_logs: "Action History",
  users: "Users",
  logs: "Time Logs",
  change_password: "Change Password",
};

export class AdminView extends Component<{ props: AdminViewProps }, AdminViewState> {
  private readonly admin_stw: AdminServerTalkerWrapper;

  constructor(props: { props: AdminViewProps }) {
    super(props);

    this.state = { view: "logs" };
    this.admin_stw = new AdminServerTalkerWrapper(this.props.props.server_talker, this.props.props.client_app, this);

    this.change_view = this.change_view.bind(this);
  }

  public render() {
    let button_options: LeftNavProps = {
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

    return (
      <div className="AdminView">
        <UserHeader></UserHeader>
        <div className="page-content">
          <LeftNav options={button_options.options}></LeftNav>
          <div>Admin view</div>
        </div>
      </div>
    );
  }

  public change_view(new_view: AdminViewType) {
    this.setState({ view: new_view });
  }
}
