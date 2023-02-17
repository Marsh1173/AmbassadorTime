import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { FetchStoredLogin } from "../utils/FetchStoredLogin";

export interface AuthenticationFormProps {
  on_submit: (username: string, password: string) => void;
  submitted: boolean;
}

export interface AuthenticationFormState {
  username: string;
  password: string;
}

export class AuthenticationForm extends Component<
  AuthenticationFormProps,
  AuthenticationFormState
> {
  constructor(props: AuthenticationFormProps) {
    super(props);
    this.state = { username: "", password: "" };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.on_submit = this.on_submit.bind(this);
  }

  private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "username") {
      this.setState({ username: value });
    } else if (name === "password") {
      this.setState({ password: value });
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
        <h1 className="title">Sign in</h1>
        <input
          name="username"
          type={"text"}
          onChange={this.handleInputChange}
          placeholder={"Username"}
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
          disabled={this.props.submitted}
        />
      </form>
    );
  }

  public componentDidMount(): void {
    FetchStoredLogin.fetch((last_used_username, last_used_password) => {
      this.setState({
        username: last_used_username,
        password: last_used_password,
      });
    });
  }

  private on_submit(ev: FormEvent) {
    ev.preventDefault();
    this.props.on_submit(this.state.username, this.state.password);
  }
}
