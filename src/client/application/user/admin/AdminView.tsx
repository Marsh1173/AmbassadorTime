import React from "react";
import { Component } from "react";
import { UserData } from "../../../../model/db/UserModel";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { LeftNav, LeftNavProps } from "../components/LeftNav";
import { UsersView } from "../components/UsersView";
import { UserHeader } from "../components/UserHeader";
import { UserViewProps } from "../UserView";
import { AdminServerTalkerWrapper } from "./AdminServerTalkerWrapper";
import { ActionHistoryView } from "../components/ActionHistoryView";

export const admin_view_types = ["logs", "users", "action_logs", "change_password"] as const;
export type AdminViewType = typeof admin_view_types[number];
const INITIAL_VIEW: AdminViewType = "users";

export type AdminViewProps = UserViewProps;
export interface AdminViewState {
  view: AdminViewType;
  users: UserData[] | undefined;
}

const button_labels: Record<AdminViewType, string> = {
  action_logs: "Action History",
  users: "Users",
  logs: "Time Logs",
  change_password: "Change Password",
};

export class AdminView extends Component<{ props: AdminViewProps }, AdminViewState> {
  private readonly admin_stw: AdminServerTalkerWrapper;
  public readonly action_log_view_ref: React.RefObject<ActionHistoryView> = React.createRef();

  constructor(props: { props: AdminViewProps }) {
    super(props);

    this.state = { view: INITIAL_VIEW, users: undefined };
    this.admin_stw = new AdminServerTalkerWrapper(this.props.props.server_talker, this.props.props.client_app, this);

    this.update_users_list = this.update_users_list.bind(this);
    this.change_view = this.change_view.bind(this);

    this.attempt_load_content = this.attempt_load_content.bind(this);
  }

  public render() {
    let button_options: LeftNavProps = {
      options: admin_view_types
        .filter((view_type) => {
          if (view_type === "change_password" && !this.props.props.user_data.is_logger) {
            return false;
          }
          return true;
        })
        .map((view_type) => {
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
          <div className="main-content">
            {this.state.view === "change_password" && (
              <ChangePasswordForm
                client_app={this.props.props.client_app}
                on_submit={(new_password) => {
                  this.admin_stw.send_attempt_change_password(new_password);
                }}
              ></ChangePasswordForm>
            )}
            {this.state.view === "users" && (
              <UsersView
                client_app={this.props.props.client_app}
                admin_stw={this.admin_stw}
                users={this.state.users}
              ></UsersView>
            )}
            {this.state.view === "action_logs" && (
              <ActionHistoryView
                ref={this.action_log_view_ref}
                client_app={this.props.props.client_app}
                admin_stw={this.admin_stw}
              ></ActionHistoryView>
            )}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.attempt_load_content(INITIAL_VIEW);
  }

  public update_users_list(users: UserData[]) {
    this.setState({ users });
  }

  public change_view(new_view: AdminViewType) {
    this.setState({ view: new_view }, () => {
      this.attempt_load_content(new_view);
    });
  }

  private attempt_load_content(view: AdminViewType) {
    if (view === "users" && this.state.users === undefined) {
      this.admin_stw.request_fetch_users();
    }
  }
}
