import React from "react";
import { Component } from "react";
import { LogModel } from "../../../../../model/db/LogModel";
import {
  UserModel,
  UserPerms,
  UserTimeData,
} from "../../../../../model/db/UserModel";
import { ATTime } from "../../../../../model/utils/ATDate";
import { MonthComponent } from "../month/MonthComponent";

export interface UserDetailViewProps {
  user_data: UserTimeData | undefined;
  logs: LogModel[];
  children?: JSX.Element | JSX.Element[];
}

interface UserDetailViewState {
  month: number;
  year: number;
}

export class UserDetailView extends Component<
  UserDetailViewProps,
  UserDetailViewState
> {
  constructor(props: UserDetailViewProps) {
    super(props);

    let now = new Date();
    this.state = {
      month: now.getMonth(),
      year: now.getFullYear(),
    };

    this.change_log_month = this.change_log_month.bind(this);
  }

  public render() {
    return (
      <div className="UserDetailView">
        <span className="title">User Details</span>
        <div className="row">
          <span className="label">Display Name:</span>
          <span className="label">{this.props.user_data?.displayname}</span>
        </div>
        <div className="row">
          <span className="label">User ID:</span>
          <span className="label">{this.props.user_data?.id}</span>
        </div>
        <div className="row">
          <span className="label">Permission Level:</span>
          <span className="label">
            {this.props.user_data?.perms.toUpperCase()}
          </span>
        </div>
        {this.props.user_data &&
          this.props.user_data.perms === UserPerms.Logger && (
            <>
              <hr />
              <span className="title">Hours</span>
              <div className="row">
                <span className="label">Total:</span>
                <span className="label">
                  {ATTime.get_hours_and_minutes_from_minutes(
                    this.props.user_data.total_time
                  )}
                </span>
              </div>
              <div className="row">
                <MonthComponent
                  on_change={this.change_log_month}
                  month={this.state.month}
                  year={this.state.year}
                  colon={true}
                ></MonthComponent>
                <span className="label">
                  {ATTime.get_hours_and_minutes_from_minutes(
                    UserModel.GetMonthTime(
                      this.props.user_data,
                      this.props.logs,
                      this.state.month,
                      this.state.year
                    )
                  )}
                </span>
              </div>
            </>
          )}
        {this.props.children}
      </div>
    );
  }

  private change_log_month(month: number, year: number) {
    this.setState({ month, year });
  }
}
