import React from "react";
import { Component } from "react";
import { UserData } from "../../../../model/db/UserModel";
import { IClientApp } from "../../ClientApp";
import { AdminServerTalkerWrapper } from "../admin/AdminServerTalkerWrapper";

export interface UsersViewProps {
  users: UserData[] | undefined;
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
        <table className="users_table">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>User ID</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {this.props.users.map((user_data) => {
              return (
                <tr key={user_data.displayname}>
                  <td className="name" key={user_data.displayname}>
                    {user_data.displayname}
                  </td>
                  <td className="id" key={user_data.id}>
                    {user_data.id}
                  </td>
                  <td className="is-admin" key={user_data.is_admin}>
                    {user_data.is_admin}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return <div className="UsersView">{child_element}</div>;
  }
}
