import React from "react";
import { Component } from "react";
import { UserData } from "../../../model/db/UserModel";
import { IServerTalker } from "../../network/ServerTalker";
import { IClientApp } from "../ClientApp";
import { UserHeader } from "./components/UserHeader";
import { UserServerTalkerWrapper } from "./UserServerTalkerWrapper";

export interface UserViewProps {
  client_app: IClientApp;
  server_talker: IServerTalker;
  user_data: UserData;
}

export interface UserViewState {}

export class UserView extends Component<
  { props: UserViewProps },
  UserViewState
> {
  private readonly user_stw: UserServerTalkerWrapper;

  constructor(props: { props: UserViewProps }) {
    super(props);

    this.state = {};

    this.user_stw = new UserServerTalkerWrapper(
      this.props.props.server_talker,
      this.props.props.client_app,
      this
    );
  }

  public render() {
    return (
      <div className="UserView">
        <UserHeader></UserHeader>
      </div>
    );
  }
}
