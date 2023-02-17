import React from "react";
import { Component } from "react";
import { IServerTalker } from "../../../network/ServerTalker";
import { TextInput } from "../../../view/components/TextInput";
import { IClientApp } from "../../ClientApp";
import { AuthenticatorServerTalkerWrapper } from "../AuthenticatorServerTalkerWrapper";
import { LoginValidator } from "../utils/LoginValidator";
import { AuthenticationForm } from "./AuthenticationForm";

export interface AuthenticationViewProps {
  client_app: IClientApp;
  server_talker: IServerTalker;
}

export interface AuthenticationViewState {
  submitted: boolean;
}

export class AuthenticationView extends Component<
  { props: AuthenticationViewProps },
  AuthenticationViewState
> {
  private readonly auth_stw: AuthenticatorServerTalkerWrapper;

  constructor(props: { props: AuthenticationViewProps }) {
    super(props);

    this.state = {
      submitted: false,
    };

    this.auth_stw = new AuthenticatorServerTalkerWrapper(
      this.props.props.server_talker,
      this.props.props.client_app
    );

    this.on_attempt_login = this.on_attempt_login.bind(this);
  }

  public render() {
    return (
      <div className="AuthenticationView">
        <h1>
          Executive Events
          <br />
          Ambassador Hour Log
        </h1>
        <AuthenticationForm
          on_submit={this.on_attempt_login}
          submitted={this.state.submitted}
        ></AuthenticationForm>
      </div>
    );
  }

  private on_attempt_login(username: string, password: string) {
    let frontend_errs: string[] =
      LoginValidator.front_end_validate_username_and_password(
        username,
        password
      );

    if (frontend_errs.length === 0) {
      this.setState({ submitted: true });
    }
  }
}
