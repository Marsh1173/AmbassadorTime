import React from "react";
import { createRoot, Root } from "react-dom/client";
import { ClientConfig } from "../utils/ClientConfig";
import {
  AuthenticationView,
  AuthenticationViewProps,
} from "./authentication/AuthenticationView";
import {
  ConnectionView,
  ConnectionViewProps,
} from "./connection/ConnectionView";
import { DisconnectionView } from "./disconnection/DisconnectionView";

import "../view/styles/MainStyles.less";
import { UserView, UserViewProps } from "./user/UserView";

export type IncompleteProps<PropType> = Omit<PropType, "client_app">;

export interface IClientApp {
  change_state_to_disconnected(msg: string): void;
  change_state_to_connecting(props: IncompleteProps<ConnectionViewProps>): void;
  change_state_to_authenticating(
    props: IncompleteProps<AuthenticationViewProps>
  ): void;
  change_state_to_user(props: IncompleteProps<UserViewProps>): void;
}

export class ClientApp implements IClientApp {
  public change_state_to_authenticating(
    props: Omit<AuthenticationViewProps, "client_app">
  ) {
    this.root.render(
      <AuthenticationView props={{ ...props, client_app: this }} />
    );
  }

  public change_state_to_connecting(
    props: IncompleteProps<ConnectionViewProps>
  ) {
    this.root.render(<ConnectionView props={{ ...props, client_app: this }} />);
  }

  public change_state_to_disconnected(msg: string) {
    this.root.render(<DisconnectionView msg={msg} />);
  }

  public change_state_to_user(props: IncompleteProps<UserViewProps>) {
    this.root.render(<UserView props={{ ...props, client_app: this }} />);
  }

  private dom_container: Element;
  private root: Root;

  constructor(private readonly config: ClientConfig) {
    let dom_container: Element | null = document.querySelector("#react-dom");
    if (dom_container === null) {
      throw new Error("Could not find react dom!");
    } else {
      this.dom_container = dom_container;
      this.root = createRoot(this.dom_container);
    }

    this.change_state_to_connecting({ config: this.config });
  }
}
