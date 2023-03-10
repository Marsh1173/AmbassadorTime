import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import {
  UserData,
  UserModel,
  UserPerms,
} from "../../../../../model/db/UserModel";
import { Modal } from "../../../../view/components/Modal";
import { IClientApp } from "../../../ClientApp";

export interface DeleteUserModalProps {
  on_confirm: (user_id_to_delete: string, password: string) => void;
  user: UserData;
}

interface DeleteUserModalState {
  visible: boolean;
  password: string;
  has_necessary_info: boolean;
}

export class DeleteUserModal extends Component<
  DeleteUserModalProps,
  DeleteUserModalState
> {
  constructor(props: DeleteUserModalProps) {
    super(props);
    this.state = {
      visible: false,
      password: "",
      has_necessary_info: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.on_submit = this.on_submit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.update_has_necessary_info = this.update_has_necessary_info.bind(this);
  }

  private handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "password") {
      this.setState({ password: value }, this.update_has_necessary_info);
    }
  }

  public render() {
    return (
      <Modal visible={this.state.visible} on_close={this.hide}>
        <form className="DeleteUserModal" onSubmit={this.on_submit}>
          <span className="title">Delete {this.props.user.displayname}</span>
          <span className="label">Confirm with your password</span>
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            placeholder={"Password"}
            maxLength={30}
          ></input>
          <span className="warning">
            When you delete a user, you delete ALL their logs too. This action
            cannot be undone!
          </span>
          <div className="row">
            <button className="cancel" onClick={this.hide}>
              Cancel
            </button>
            <input
              className="submit"
              type={"submit"}
              value={"Delete User"}
              disabled={!this.state.has_necessary_info}
            />
          </div>
        </form>
      </Modal>
    );
  }

  public show() {
    this.setState({ visible: true });
  }

  private hide() {
    this.setState({ visible: false });
  }

  private on_submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    this.props.on_confirm(this.props.user.id, this.state.password);
    this.setState({
      visible: false,
      password: "",
      has_necessary_info: false,
    });
  }

  private update_has_necessary_info() {
    let new_state: boolean = true;

    if (this.state.password === "") {
      new_state = false;
    }

    this.setState({ has_necessary_info: new_state });
  }
}
