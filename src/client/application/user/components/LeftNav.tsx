import React from "react";
import { Component } from "react";

export interface LeftNavProps {
  options: { name: string; action: () => void; selected: boolean }[];
}

export class LeftNav extends Component<LeftNavProps, {}> {
  constructor(props: LeftNavProps) {
    super(props);
  }

  public render() {
    let options: JSX.Element[] = this.props.options.map((option) => {
      return (
        <button key={option.name} className={`option` + (option.selected ? " selected" : "")} onClick={option.action}>
          {option.name}
        </button>
      );
    });
    return <div className="LeftNav">{options}</div>;
  }
}
