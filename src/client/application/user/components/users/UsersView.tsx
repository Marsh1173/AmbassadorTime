import React, { Component } from "react";
import { UserTimeData, UserPerms } from "../../../../../model/db/UserModel";
import { ATTime } from "../../../../../model/utils/ATDate";
import { IClientApp } from "../../../ClientApp";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";
import { CreateUserModal } from "./CreateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";

export interface UsersViewProps {
  users: UserTimeData[] | undefined;
  admin_stw: AdminServerTalkerWrapper;
  client_app: IClientApp;
}

export class UsersView extends Component<UsersViewProps, {}> {
  private readonly create_user_modal_ref: React.RefObject<CreateUserModal> =
    React.createRef();
  private readonly delete_user_modal_ref: React.RefObject<DeleteUserModal> =
    React.createRef();
  constructor(props: UsersViewProps) {
    super(props);
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
                  <tr key={user_data.displayname}>
                    <td className="name">
                      {user_data.displayname}
                      {user_data.perms === UserPerms.Admin && " (admin)"}
                    </td>
                    <td className="id">{user_data.id}</td>
                    <td className="time">
                      {user_data.perms === UserPerms.Logger
                        ? ATTime.get_hours_and_minutes_from_minutes(
                            user_data.time
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
        {child_element}
        <div className="footer">
          <button
            className="delete"
            onClick={() => {
              this.delete_user_modal_ref.current?.show();
            }}
          >
            Delete
          </button>
          <button
            className="create"
            onClick={() => {
              this.create_user_modal_ref.current?.show();
            }}
          >
            Create
          </button>
        </div>
        <CreateUserModal
          ref={this.create_user_modal_ref}
          client_app={this.props.client_app}
          on_confirm={(display_name: string, user_id: string) => {
            this.props.admin_stw.attempt_create_user(display_name, user_id);
          }}
        ></CreateUserModal>
        <DeleteUserModal
          ref={this.delete_user_modal_ref}
          on_confirm={(user_id_to_delete: string, password: string) => {
            this.props.admin_stw.attempt_delete_user(
              user_id_to_delete,
              password
            );
          }}
          users={this.props.users}
        ></DeleteUserModal>
      </div>
    );
  }
}
