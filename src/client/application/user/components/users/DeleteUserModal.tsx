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
  users: UserData[] | undefined;
}

interface DeleteUserModalState {
  visible: boolean;
  user_id_to_delete: string;
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
      user_id_to_delete: "",
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

    if (name === "user_id_to_delete") {
      this.setState(
        { user_id_to_delete: value },
        this.update_has_necessary_info
      );
    } else if (name === "password") {
      this.setState({ password: value }, this.update_has_necessary_info);
    }
  }

  private readonly DEFAULT_USER: JSX.Element = (<option value={""}></option>);

  public render() {
    let user_options: JSX.Element[] = [this.DEFAULT_USER];
    if (this.props.users !== undefined) {
      user_options = user_options.concat(
        this.props.users
          .filter((user_data) => user_data.perms !== UserPerms.Admin)
          .map((user_data) => {
            return (
              <option key={user_data.id} value={user_data.id}>
                {user_data.id}
              </option>
            );
          })
      );
    }

    return (
      <Modal visible={this.state.visible} on_close={this.hide}>
        <form className="DeleteUserModal" onSubmit={this.on_submit}>
          <span className="title">Delete User</span>
          <select
            name="user_id_to_delete"
            value={this.state.user_id_to_delete}
            onChange={this.handleInputChange}
          >
            {user_options}
          </select>
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

    if (
      window.confirm(
        "Are you sure you want to delete " + this.state.user_id_to_delete + "?"
      )
    ) {
      this.props.on_confirm(this.state.user_id_to_delete, this.state.password);
      this.setState({
        visible: false,
        user_id_to_delete: "",
        password: "",
        has_necessary_info: false,
      });
    }
  }

  private update_has_necessary_info() {
    let new_state: boolean = true;

    if (this.state.user_id_to_delete === "" || this.state.password === "") {
      new_state = false;
    }

    this.setState({ has_necessary_info: new_state });
  }
}
