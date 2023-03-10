import React, { Component } from "react";
import { LogModel } from "../../../../../model/db/LogModel";
import { UserTimeData, UserPerms } from "../../../../../model/db/UserModel";
import { ATTime } from "../../../../../model/utils/ATDate";
import { IClientApp } from "../../../ClientApp";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";
import { CreateUserModal } from "./CreateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { UserDetailModal } from "./UserDetailModal";

export interface UsersViewProps {
  users: UserTimeData[] | undefined;
  admin_stw: AdminServerTalkerWrapper;
  client_app: IClientApp;
  logs: LogModel[];
}

export interface UsersViewState {
  selected_user: UserTimeData | undefined;
}

export class UsersView extends Component<UsersViewProps, UsersViewState> {
  private readonly create_user_modal_ref: React.RefObject<CreateUserModal> =
    React.createRef();
  private readonly user_detail_modal_ref: React.RefObject<UserDetailModal> =
    React.createRef();
  constructor(props: UsersViewProps) {
    super(props);

    this.state = { selected_user: undefined };

    this.open_user = this.open_user.bind(this);
  }

  public render() {
    let child_element: JSX.Element = <span>Loading...</span>;
    if (this.props.users !== undefined) {
      child_element = (
        <div className="table-container">
          <table className="users_table">
            <thead>
              <tr>
                <th className="name">Display Name</th>
                <th className="id">User ID</th>
                <th className="time">Hours</th>
              </tr>
            </thead>
            <tbody>
              {this.props.users.map((user_data) => {
                return (
                  <tr
                    key={user_data.displayname}
                    onClick={() => this.open_user(user_data)}
                  >
                    <td className="name">
                      {user_data.displayname}
                      {user_data.perms === UserPerms.Admin && " (admin)"}
                    </td>
                    <td className="id">{user_data.id}</td>
                    <td className="time">
                      {user_data.perms === UserPerms.Logger
                        ? ATTime.get_hours_and_minutes_from_minutes(
                            user_data.total_time
                          )
                        : "N/A"}
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
      <div className="UsersView">
        <button
          className="create"
          onClick={() => {
            this.create_user_modal_ref.current?.show();
          }}
        >
          New User
        </button>
        {child_element}
        <span className="info">Click on a row to see more.</span>
        <CreateUserModal
          ref={this.create_user_modal_ref}
          client_app={this.props.client_app}
          on_confirm={(display_name: string, user_id: string) => {
            this.props.admin_stw.attempt_create_user(display_name, user_id);
          }}
        ></CreateUserModal>
        <UserDetailModal
          ref={this.user_detail_modal_ref}
          admin_stw={this.props.admin_stw}
          logs={this.props.logs}
        ></UserDetailModal>
      </div>
    );
  }

  private open_user(user_data: UserTimeData) {
    if (this.user_detail_modal_ref.current) {
      this.user_detail_modal_ref.current.show(user_data);
    }
  }
}
