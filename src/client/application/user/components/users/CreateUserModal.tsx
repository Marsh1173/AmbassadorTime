import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { Modal } from "../../../../view/components/Modal";
import { IClientApp } from "../../../ClientApp";

export interface CreateUserModalProps {
  on_confirm: (displayname: string, user_id: string) => void;
  client_app: IClientApp;
}

interface CreateUserModalState {
  visible: boolean;
  displayname: string;
  user_id: string;
  has_necessary_info: boolean;
}

export class CreateUserModal extends Component<
  CreateUserModalProps,
  CreateUserModalState
> {
  constructor(props: CreateUserModalProps) {
    super(props);
    this.state = {
      visible: false,
      displayname: "",
      user_id: "",
      has_necessary_info: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.on_submit = this.on_submit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.update_has_necessary_info = this.update_has_necessary_info.bind(this);
  }

  private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "displayname") {
      this.setState({ displayname: value }, this.update_has_necessary_info);
    } else if (name === "user_id") {
      this.setState({ user_id: value }, this.update_has_necessary_info);
    }
  }

  public render() {
    return (
      <Modal visible={this.state.visible} on_close={this.hide}>
        <form className="CreateUserModal" onSubmit={this.on_submit}>
          <span className="title">Create New User</span>
          <input
            name="displayname"
            type="text"
            value={this.state.displayname}
            onChange={this.handleInputChange}
            placeholder={"Name"}
            maxLength={30}
          ></input>
          <input
            name="user_id"
            type="text"
            value={this.state.user_id}
            onChange={this.handleInputChange}
            placeholder={"User ID"}
            maxLength={30}
          ></input>
          <div className="row">
            <button onClick={this.hide}>Cancel</button>
            <input
              type={"submit"}
              value={"Submit"}
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

    let target_date_time_ms: number = Date.parse(this.state.target_date_time);
    if (Number.isNaN(target_date_time_ms)) {
      this.props.client_app.growl_service.put_growl(
        "Invalid date / time",
        "bad"
      );
      return;
    }

    this.props.on_confirm(this.state.displayname, this.state.user_id);
    this.setState({
      visible: false,
      displayname: "",
      user_id: "",
      has_necessary_info: false,
    });
  }

  private update_has_necessary_info() {
    let new_state: boolean = true;

    if (this.state.displayname === "" || this.state.user_id === "") {
      new_state = false;
    }

    this.setState({ has_necessary_info: new_state });
  }
}
