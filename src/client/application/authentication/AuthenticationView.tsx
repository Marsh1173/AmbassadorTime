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
}

export class AuthenticationView extends Component<{ props: AuthenticationViewProps }, AuthenticationViewState> {
  private readonly auth_stw: AuthenticatorServerTalkerWrapper;

  constructor(props: { props: AuthenticationViewProps }) {
    super(props);

    this.state = {
      submitted: false,
    };

    this.auth_stw = new AuthenticatorServerTalkerWrapper(
      this.props.props.server_talker,
      this.props.props.client_app,
      this
    );

    this.set_submitted = this.set_submitted.bind(this);
    this.on_attempt_login = this.on_attempt_login.bind(this);
    this.on_successful_login = this.on_successful_login.bind(this);
  }

  public render() {
    return (
      <div className="AuthenticationView">
        <AuthenticationForm on_submit={this.on_attempt_login} submitted={this.state.submitted}></AuthenticationForm>
      </div>
    );
  }

  public set_submitted(val: boolean) {
    this.setState({ submitted: val });
  }

  private last_attempted_username: string = "";
  private last_attempted_password: string = "";
  private on_attempt_login(username: string, password: string) {
    let frontend_errs: string[] = LoginValidator.front_end_validate_username_and_password(username, password);

    if (frontend_errs.length === 0) {
      this.set_submitted(true);
      this.last_attempted_username = username;
      this.last_attempted_password = password;
      this.auth_stw.send_login(username, password);
    } else {
      for (const err of frontend_errs) {
        this.props.props.client_app.growl_service.put_growl(err, "bad");
      }
    }
  }

  public on_successful_login(user_data: UserData) {
    let server_talker: IServerTalker = this.auth_stw.deconstruct();
    SaveSuccessfulLogin.save_successful_login(this.last_attempted_username, this.last_attempted_password);
    this.props.props.client_app.growl_service.put_growl("Welcome, " + user_data.displayname + "!", "good");
    this.props.props.client_app.change_state_to_user({
      user_data,
      server_talker,
    });
  }
}
