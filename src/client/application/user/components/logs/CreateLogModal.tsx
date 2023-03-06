import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { UserData } from "../../../../../model/db/UserModel";
import { Modal } from "../../../../view/components/Modal";
import { IClientApp } from "../../../ClientApp";

export interface CreateLogModalProps {
  on_confirm: (
    short_description: string,
    target_date_time_ms: number,
    minutes_logged: number
  ) => void;
  client_app: IClientApp;
}

interface CreateLogModalState {
  visible: boolean;
  short_description: string;
  target_date_time: string;
  hours: string;
  minutes: string;
  has_necessary_info: boolean;
}

export class CreateLogModal extends Component<
  CreateLogModalProps,
  CreateLogModalState
> {
  constructor(props: CreateLogModalProps) {
    super(props);
    this.state = {
      visible: false,
      short_description: "",
      target_date_time: "",
      hours: "0",
      minutes: "0",
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

    if (name === "short_description") {
      this.setState(
        { short_description: value },
        this.update_has_necessary_info
      );
    } else if (name === "target_date_time") {
      this.setState(
        { target_date_time: value },
        this.update_has_necessary_info
      );
    } else if (name === "hours") {
      this.setState(
        { hours: this.min_max_str(value, 0, 23) },
        this.update_has_necessary_info
      );
    } else if (name === "minutes") {
      this.setState(
        { minutes: this.min_max_str(value, 0, 59) },
        this.update_has_necessary_info
      );
    }
  }

  public render() {
    return (
      <Modal visible={this.state.visible} on_close={this.hide}>
        <form className="CreateLogModal" onSubmit={this.on_submit}>
          <span className="title">Create Log</span>
          <input
            name="short_description"
            type="text"
            value={this.state.short_description}
            onChange={this.handleInputChange}
            placeholder={"Short description"}
            maxLength={30}
          ></input>
          <span className="label">Date / Time</span>
          <input
            name="target_date_time"
            type="datetime-local"
            value={this.state.target_date_time}
            onChange={this.handleInputChange}
          ></input>
          <span className="label">Hours</span>
          <input
            name="hours"
            type="number"
            value={this.state.hours}
            onChange={this.handleInputChange}
          ></input>
          <span className="label">Minutes</span>
          <input
            name="minutes"
            type="number"
            value={this.state.minutes}
            onChange={this.handleInputChange}
          ></input>
          <div className="row">
            <button className="cancel" onClick={this.hide}>
              Cancel
            </button>
            <input
              className="submit"
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

    this.props.on_confirm(
      this.state.short_description,
      target_date_time_ms,
      Number(this.state.hours) * 60 + Number(this.state.minutes)
    );
    this.setState({
      visible: false,
      short_description: "",
      target_date_time: "",
      hours: "0",
      minutes: "0",
      has_necessary_info: false,
    });
  }

  private update_has_necessary_info() {
    let new_state: boolean = true;

    if (this.state.hours === "" || this.state.minutes === "") {
      new_state = false;
    }
    if (this.state.hours === "0" && this.state.minutes === "0") {
      new_state = false;
    }
    if (this.state.short_description.trim() === "") {
      new_state = false;
    }
    if (this.state.target_date_time === "") {
      new_state = false;
    }

    this.setState({ has_necessary_info: new_state });
  }

  private min_max_str(str: string, min: number, max: number): string {
    return Math.min(max, Math.max(Number(str), min)).toString();
  }
}
