import React from "react";
import { Component } from "react";
import { IServerTalker } from "../../network/ServerTalker";
import { LocalStorage } from "../../utils/LocalStorage";
import { IClientApp } from "../ClientApp";
import { AuthenticatorServerTalkerWrapper } from "./AuthenticatorServerTalkerWrapper";
import { FetchStoredLogin } from "./utils/FetchStoredLogin";

export interface AuthenticationViewProps {
  client_app: IClientApp;
  server_talker: IServerTalker;
}

export interface AuthenticationViewState {
  view: "login" | "register";
  waiting: boolean;
}

export class AuthenticationView extends Component<
  { props: AuthenticationViewProps },
  AuthenticationViewState
> {
  private readonly auth_stw: AuthenticatorServerTalkerWrapper;
  constructor(props: { props: AuthenticationViewProps }) {
    super(props);

    this.state = {
      view: "login",
      waiting: false,
    };

    this.auth_stw = new AuthenticatorServerTalkerWrapper(
      this.props.props.server_talker
    );
  }

  public render() {
    return (
      <div>
        <h1>
          Executive Events
          <br />
          Ambassador Hour Log
        </h1>
        <span>Authenticating</span>
      </div>
    );
  }

  public componentDidMount(): void {
    FetchStoredLogin.fetch((last_used_username, last_used_password) => {
      // fill in inputs
    });
  }
}
