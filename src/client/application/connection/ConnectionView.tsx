import React from "react";
import { Component } from "react";
import { IServerTalker, ServerTalker } from "../../network/ServerTalker";
import { ClientConfig } from "../../utils/ClientConfig";
import { IClientApp } from "../ClientApp";

export interface ConnectionViewProps {
  client_app: IClientApp;
  config: ClientConfig;
}

export class ConnectionView extends Component<
  { props: ConnectionViewProps },
  {}
> {
  public render() {
    let server_talker: IServerTalker = new ServerTalker(
      this.props.props.config,
      (server_talker: IServerTalker) => {
        this.props.props.client_app.change_state_to_authenticating({
          server_talker,
        });
      }
    );

    return (
      <div>
        <span>Connecting...</span>
      </div>
    );
  }
}
