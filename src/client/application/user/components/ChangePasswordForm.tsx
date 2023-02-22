import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { IClientApp } from "../../ClientApp";

export interface ChangePasswordFormProps {
  on_submit: (new_password: string) => void;
  client_app: IClientApp;
}

export interface ChangePasswordFormState {
  new_password: string;
  confirm_password: string;
  has_necessary_values: boolean;
}

export class ChangePasswordForm extends Component<ChangePasswordFormProps, ChangePasswordFormState> {
  constructor(props: ChangePasswordFormProps) {
    super(props);
    this.state = { new_password: "", confirm_password: "", has_necessary_values: false };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.on_submit = this.on_submit.bind(this);
  }

  private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const update_has_necessary_values = () => {
      if (this.state.new_password !== "" && this.state.confirm_password !== "") {
        this.setState({ has_necessary_values: true });
      } else {
        this.setState({ has_necessary_values: false });
      }
    };

    if (name === "new_password") {
      this.setState({ new_password: value }, update_has_necessary_values);
    } else if (name === "confirm_password") {
      this.setState({ confirm_password: value }, update_has_necessary_values);
    }
  }

  public render() {
    return (
      <form
        className="ChangePasswordForm"
        onSubmit={(ev) => {
          this.on_submit(ev);
        }}
      >
        <h1 className="title">Change Password</h1>
        <input
          name="new_password"
          type={"password"}
          value={this.state.new_password}
          onChange={this.handleInputChange}
          placeholder={"New Password"}
          autoComplete={"new-password"}
        />
        <input
          name="confirm_password"
          type="password"
          value={this.state.confirm_password}
          onChange={this.handleInputChange}
          placeholder={"Confirm Password"}
          autoComplete={"confirm-password"}
        />
        <input type={"submit"} value={"Change"} disabled={!this.state.has_necessary_values} />
      </form>
    );
  }

  private validate_passwords_are_the_same(new_password: string, confirm_password: string): boolean {
    return new_password === confirm_password;
  }

  private on_submit(ev: FormEvent) {
    ev.preventDefault();

    if (this.validate_passwords_are_the_same(this.state.new_password, this.state.confirm_password)) {
      if (window.confirm("Are you sure you want to change your password?")) {
        this.props.on_submit(this.state.new_password);
        this.setState({ new_password: "", confirm_password: "", has_necessary_values: false });
      }
    } else {
      this.props.client_app.growl_service.put_growl("Passwords must match", "bad");
    }
  }
}
