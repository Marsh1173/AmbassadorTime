import React from "react";
import { Component } from "react";
import { ATTime } from "../../../../../model/utils/ATDate";

export interface MonthComponentProps {
  on_change(month: number, year: number): void;
  month: number;
  year: number;
  colon: boolean;
}

export class MonthComponent extends Component<MonthComponentProps, {}> {
  constructor(props: MonthComponentProps) {
    super(props);
  }

  public render() {
    return (
      <div className="MonthComponent">
        <button
          className="decrease"
          onClick={() => {
            let new_month: number = this.props.month - 1;
            if (new_month < 0) {
              this.props.on_change(new_month + 12, this.props.year - 1);
            } else {
              this.props.on_change(new_month, this.props.year);
            }
          }}
        >
          -
        </button>
        <span className="month">
          {ATTime.month_to_string(this.props.month) +
            ", " +
            this.props.year +
            (this.props.colon ? ":" : "")}
        </span>
        <button
          className="increase"
          onClick={() => {
            let new_month: number = this.props.month + 1;
            if (new_month > 11) {
              this.props.on_change(new_month - 12, this.props.year + 1);
            } else {
              this.props.on_change(new_month, this.props.year);
            }
          }}
        >
          +
        </button>
      </div>
    );
  }
}
