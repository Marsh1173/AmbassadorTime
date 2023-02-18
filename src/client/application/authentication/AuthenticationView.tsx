import React from "react";
import { Component } from "react";
import { UserData } from "../../../model/db/UserModel";
import { IServerTalker } from "../../network/ServerTalker";
import { TextInput } from "../../view/components/TextInput";
import { IClientApp } from "../ClientApp";
import { AuthenticatorServerTalkerWrapper } from "./AuthenticatorServerTalkerWrapper";
import { LoginValidator } from "./utils/LoginValidator";
import { AuthenticationForm } from "./components/AuthenticationForm";
import { SaveSuccessfulLogin } from "./utils/SaveSuccessfulLogin";

export interface AuthenticationViewProps {
  client_app: IClientApp;
  server_talker: IServerTalker;
}

export interface AuthenticationViewState {
  submitted: boolean;
  errors: string[];
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
      errors: [],
    };

    this.auth_stw = new AuthenticatorServerTalkerWrapper(
      this.props.props.server_talker,
      this.props.props.client_app,
      this
    );

    this.show_errors = this.show_errors.bind(this);
    this.set_submitted = this.set_submitted.bind(this);
    this.on_attempt_login = this.on_attempt_login.bind(this);
    this.on_successful_login = this.on_successful_login.bind(this);
  }

  public render() {
    let error_spans: JSX.Element[] = this.state.errors.map((error) => {
      return (
        <span className="error" key={error}>
          {error}
        </span>
      );
    });
    return (
      <div className="AuthenticationView">
        <AuthenticationForm
          on_submit={this.on_attempt_login}
          submitted={this.state.submitted}
        ></AuthenticationForm>
        {error_spans}
      </div>
    );
  }

  public show_errors(errors: string[]) {
    this.setState({ errors });
  }

  public set_submitted(val: boolean) {
    this.setState({ submitted: val });
  }

  private last_attempted_username: string = "";
  private last_attempted_password: string = "";
  private on_attempt_login(username: string, password: string) {
    this.show_errors([]);

    let frontend_errs: string[] =
      LoginValidator.front_end_validate_username_and_password(
        username,
        password
      );

    if (frontend_errs.length === 0) {
      this.set_submitted(true);
      this.last_attempted_username = username;
      this.last_attempted_password = password;
      this.auth_stw.send_login(username, password);
    } else {
      this.show_errors(frontend_errs);
    }
  }

  public on_successful_login(user_data: UserData) {
    let server_talker: IServerTalker = this.auth_stw.deconstruct();
    SaveSuccessfulLogin.save_successful_login(
      this.last_attempted_username,
      this.last_attempted_password
    );
    this.props.props.client_app.change_state_to_user({
      user_data,
      server_talker,
    });
  }
}
