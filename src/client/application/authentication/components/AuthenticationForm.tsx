import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { FetchStoredLogin } from "../utils/FetchStoredLogin";

export interface AuthenticationFormProps {
  on_submit: (username: string, password: string) => void;
  submitted: boolean;
}

export interface AuthenticationFormState {
  user_id: string;
  password: string;
  has_necessary_info: boolean;
}

export class AuthenticationForm extends Component<
  AuthenticationFormProps,
  AuthenticationFormState
> {
  constructor(props: AuthenticationFormProps) {
    super(props);
    this.state = { user_id: "", password: "", has_necessary_info: false };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.on_submit = this.on_submit.bind(this);
    this.update_has_necessary_info = this.update_has_necessary_info.bind(this);
  }

  private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "username") {
      this.setState({ user_id: value }, this.update_has_necessary_info);
    } else if (name === "password") {
      this.setState({ password: value }, this.update_has_necessary_info);
    }
  }

  public render() {
    return (
      <form
        className="AuthenticationForm"
        onSubmit={(ev) => {
          this.on_submit(ev);
        }}
      >
        <h1 className="title">
          Executive Events
          <br />
          Ambassador Time Log
        </h1>
        <input
          name="username"
          type={"text"}
          value={this.state.user_id}
          onChange={this.handleInputChange}
          placeholder={"User ID"}
        />
        <input
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleInputChange}
          placeholder={"Password"}
        />
        <input
          type={"submit"}
          value={this.props.submitted ? "Signing in..." : "Sign in"}
          disabled={this.props.submitted || !this.state.has_necessary_info}
        />
      </form>
    );
  }

  public componentDidMount(): void {
    FetchStoredLogin.fetch((last_used_username, last_used_password) => {
      this.setState(
        {
          user_id: last_used_username,
          password: last_used_password,
        },
        this.update_has_necessary_info
      );
    });
  }

  private on_submit(ev: FormEvent) {
    ev.preventDefault();
    this.props.on_submit(this.state.user_id, this.state.password);
  }

  private update_has_necessary_info() {
    if (this.state.user_id !== "" && this.state.password !== "") {
      this.setState({ has_necessary_info: true });
    } else {
      this.setState({ has_necessary_info: false });
    }
  }
}
