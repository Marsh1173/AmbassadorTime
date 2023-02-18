import React from "react";
import { Component } from "react";

export class UserHeader extends Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="UserHeader">
        <div className="width-container">
          <span className="logo">Ambassador Time Log</span>
        </div>
      </div>
    );
  }
}
