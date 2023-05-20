import React from "react";
import { Component } from "react";
import { ATTime } from "../../../../model/utils/ATDate";
import { AdminServerTalkerWrapper } from "../admin/AdminServerTalkerWrapper";

export interface ActionHistoryViewProps {
  admin_stw: AdminServerTalkerWrapper;
}
export interface ActionHistoryViewState {
  month: number;
  year: number;
  action_log: string | undefined | "loading";
}

export class ActionHistoryView extends Component<ActionHistoryViewProps, ActionHistoryViewState> {
  constructor(props: ActionHistoryViewProps) {
    super(props);

    let date: Date = new Date();
    this.state = {
      month: date.getMonth(),
      year: date.getFullYear(),
      action_log: "loading",
    };

    this.change_month = this.change_month.bind(this);
    this.update_action_log = this.update_action_log.bind(this);
  }

  public render() {
    let action_log_elem: JSX.Element;

    if (this.state.action_log === "loading") {
      action_log_elem = <span className="loading">Loading...</span>;
      this.props.admin_stw.request_fetch_action_logs(this.state.month, this.state.year);
    } else if (this.state.action_log === undefined) {
      action_log_elem = <span className="none">Nothing found for this month.</span>;
    } else {
      action_log_elem = <div className="action-log-container">{this.get_action_log_elems(this.state.action_log)}</div>;
    }

    return (
      <div className="ActionHistoryView">
        <div className="header">
          <button onClick={() => this.change_month("back")}>Previous Month</button>
          <span>{ATTime.month_to_string(this.state.month) + ", " + this.state.year}</span>
          <button onClick={() => this.change_month("forward")}>Next Month</button>
        </div>
        {action_log_elem}
      </div>
    );
  }

  private get_action_log_elems(action_log: string): JSX.Element[] {
    return action_log
      .split("\n")
      .filter((str) => str !== "")
      .map((line) => {
        return (
          <span className="action-log" key={line}>
            {line}
          </span>
        );
      })
      .reverse();
  }

  private change_month(direction: "back" | "forward") {
    let updated_month: number;
    let updated_year: number;
    if (direction === "back") {
      updated_month = this.state.month - 1;
      updated_year = this.state.year;
      if (updated_month < 0) {
        updated_month += 12;
        updated_year -= 1;
      }
    } else {
      updated_month = this.state.month + 1;
      updated_year = this.state.year;
      if (updated_month > 11) {
        updated_month -= 12;
        updated_year += 1;
      }
    }

    this.setState({
      month: updated_month,
      year: updated_year,
      action_log: "loading",
    });
  }

  public update_action_log(month: number, year: number, data: string | undefined) {
    if (month === this.state.month && year === this.state.year) {
      this.setState({ action_log: data });
    }
  }
}
