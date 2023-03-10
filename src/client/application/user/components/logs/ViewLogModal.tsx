import React from "react";
import { Component } from "react";
import { LogModel } from "../../../../../model/db/LogModel";
import { ATTime } from "../../../../../model/utils/ATDate";
import { Modal } from "../../../../view/components/Modal";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";
import { LoggerServerTalkerWrapper } from "../../logger/LoggerServerTalkerWrapper";

export interface ViewLogModalProps {
  perms:
    | { is_admin: false; stw: LoggerServerTalkerWrapper }
    | { is_admin: true; stw: AdminServerTalkerWrapper };
}

interface ViewLogModalState {
  selected_log: LogModel | undefined;
}

export class ViewLogModal extends Component<
  ViewLogModalProps,
  ViewLogModalState
> {
  constructor(props: ViewLogModalProps) {
    super(props);
    this.state = {
      selected_log: undefined,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.delete_log = this.delete_log.bind(this);
  }

  public render() {
    let log_element: JSX.Element | undefined = undefined;
    if (this.state.selected_log !== undefined) {
      log_element = (
        <>
          <hr />
          <span className="label">
            {this.state.selected_log.short_description}
          </span>
          {this.props.perms.is_admin && (
            <div className="row">
              <span className="label">User:</span>
              <span className="label">{this.state.selected_log.user_id}</span>
            </div>
          )}
          <div className="row">
            <span className="label">Date:</span>
            <span className="label">
              {ATTime.get_date_from_ms(
                this.state.selected_log.target_date_time_ms
              )}
            </span>
          </div>
          <div className="row">
            <span className="label">Hours + minutes:</span>
            <span className="label">
              {ATTime.get_hours_and_minutes_from_minutes(
                this.state.selected_log.minutes_logged
              )}
            </span>
          </div>
          <div className="row">
            <span className="label">Date logged:</span>
            <span className="label">
              {ATTime.get_date_from_ms(this.state.selected_log.time_logged_ms)}
            </span>
          </div>
        </>
      );
    }

    return (
      <Modal
        visible={this.state.selected_log !== undefined}
        on_close={this.hide}
      >
        <div className="ViewLogModal">
          <span className="title">Log Details</span>
          {log_element}
          <hr />
          <div className="row">
            <button className="close" onClick={this.hide}>
              {this.props.perms.is_admin ? "Cancel" : "Close"}
            </button>
            {this.props.perms.is_admin && (
              <button className="delete" onClick={this.delete_log}>
                Delete
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  public show(log_data: LogModel) {
    this.setState({ selected_log: log_data });
  }

  private hide() {
    this.setState({
      selected_log: undefined,
    });
  }

  private delete_log() {
    if (
      this.props.perms.is_admin &&
      this.state.selected_log !== undefined &&
      window.confirm("Are you sure? Deleting this log cannot be undone.")
    ) {
      this.props.perms.stw.attempt_delete_log(this.state.selected_log.id);
      this.setState({
        selected_log: undefined,
      });
    }
  }
}
