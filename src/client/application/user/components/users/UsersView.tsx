import React, { Component } from "react";
import { UserTimeData, UserPerms } from "../../../../../model/db/UserModel";
import { IClientApp } from "../../../ClientApp";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";

export interface UsersViewProps {
  users: UserTimeData[] | undefined;
  admin_stw: AdminServerTalkerWrapper;
  client_app: IClientApp;
}

export class UsersView extends Component<UsersViewProps, {}> {
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
                    <td className="name" key={user_data.displayname}>
                      {user_data.displayname}
                      {user_data.perms === UserPerms.Admin && " (admin)"}
                    </td>
                    <td className="id" key={user_data.id}>
                      {user_data.id}
                    </td>
                    <td className="time" key={user_data.id + user_data.time}>
                      {user_data.perms === UserPerms.Logger
                        ? user_data.time
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
          <button className="delete" onClick={() => {}}>
            Delete
          </button>
          <button className="create" onClick={() => {}}>
            Create
          </button>
        </div>
      </div>
    );
  }
}
