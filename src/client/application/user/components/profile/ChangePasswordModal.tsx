import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { Modal } from "../../../../view/components/Modal";
import { IClientApp } from "../../../ClientApp";
import { LoggerServerTalkerWrapper } from "../../logger/LoggerServerTalkerWrapper";

export interface ChangePasswordModalProps {
  client_app: IClientApp;
  logger_stw: LoggerServerTalkerWrapper;
}

export interface ChangePasswordModalState {
  visible: boolean;
  new_password: string;
  confirm_password: string;
  has_necessary_values: boolean;
}

export class ChangePasswordModal extends Component<
  ChangePasswordModalProps,
  ChangePasswordModalState
> {
  private readonly modal_ref: React.RefObject<ConfirmChangePasswordModal> =
    React.createRef();
  constructor(props: ChangePasswordModalProps) {
    super(props);
    this.state = {
      visible: false,
      new_password: "",
      confirm_password: "",
      has_necessary_values: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.on_submit = this.on_submit.bind(this);
    this.confirm_change_password = this.confirm_change_password.bind(this);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const update_has_necessary_values = () => {
      if (
        this.state.new_password !== "" &&
        this.state.confirm_password !== ""
      ) {
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
      <Modal visible={this.state.visible} on_close={this.hide}>
        <form
          className="ChangePasswordModal"
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
          <div className="row">
            <input
              className="submit"
              type={"submit"}
              value={"Change"}
              disabled={!this.state.has_necessary_values}
            />
            <button className="cancel" onClick={() => this.hide()}>
              Cancel
            </button>
          </div>

          <ConfirmChangePasswordModal
            on_confirm={() => {
              this.confirm_change_password();
            }}
            ref={this.modal_ref}
          ></ConfirmChangePasswordModal>
        </form>
      </Modal>
    );
  }

  private validate_passwords_are_the_same(
    new_password: string,
    confirm_password: string
  ): boolean {
    return new_password === confirm_password;
  }

  private on_submit(ev: FormEvent) {
    ev.preventDefault();
    if (
      this.validate_passwords_are_the_same(
        this.state.new_password,
        this.state.confirm_password
      )
    ) {
      this.modal_ref.current?.show();
    } else {
      this.props.client_app.growl_service.put_growl(
        "Passwords must match",
        "bad"
      );
    }
  }

  private confirm_change_password() {
    this.props.logger_stw.send_attempt_change_password(this.state.new_password);
    this.setState({
      visible: false,
      new_password: "",
      confirm_password: "",
      has_necessary_values: false,
    });
  }

  public show() {
    this.setState({ visible: true });
  }

  private hide() {
    this.setState({ visible: false });
  }
}

class ConfirmChangePasswordModal extends Component<
  { on_confirm: () => void },
  { visible: boolean }
> {
  constructor(props: { on_confirm: () => void }) {
    super(props);
    this.state = { visible: false };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  public render() {
    return (
      <Modal visible={this.state.visible} on_close={this.hide}>
        <div className="ConfirmChangePasswordModal">
          <span>Change password?</span>
          <div className="buttons">
            <button
              className="yes"
              onClick={(ev) => {
                ev.preventDefault();
                this.hide();
                this.props.on_confirm();
              }}
            >
              Yes
            </button>
            <button
              className="no"
              onClick={(ev) => {
                ev.preventDefault();
                this.hide();
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  public show() {
    this.setState({ visible: true });
  }

  private hide() {
    this.setState({ visible: false });
  }
}
