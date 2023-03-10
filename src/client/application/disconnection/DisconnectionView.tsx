import React from "react";
import { Component } from "react";

export class DisconnectionView extends Component<{ msg: string }, {}> {
  public render() {
    return (
      <div>
        <span>{this.props.msg}</span>
        <button onClick={() => location.reload()}>
          <span>Refresh</span>
        </button>
        <span>If you cannot connect, reach out to natehroylance@gmail.com</span>
      </div>
    );
  }
}
