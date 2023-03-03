import React from "react";
import { Component } from "react";
import { LogData } from "../../../model/db/LogModel";
import { UserData } from "../../../model/db/UserModel";
import { IServerTalker } from "../../network/ServerTalker";
import { IClientApp } from "../ClientApp";
import { LeftNav, LeftNavProps } from "./components/LeftNav";
import { UserHeader } from "./components/UserHeader";

export interface UserViewProps {
  client_app: IClientApp;
  server_talker: IServerTalker;
  user_data: UserData;
}

export interface UserViewState<ViewType> {
  view: ViewType;
  logs: LogData[] | undefined;
}

export abstract class UserView<
  ViewType,
  Props extends UserViewProps,
  State extends UserViewState<ViewType>
> extends Component<{ props: Props }, State> {
  constructor(props: { props: Props }, initial_state: State) {
    super(props);

    this.state = initial_state;
    this.change_view = this.change_view.bind(this);
    this.update_logs_list = this.update_logs_list.bind(this);
    this.attempt_load_content = this.attempt_load_content.bind(this);
    this.get_left_nav_buttons = this.get_left_nav_buttons.bind(this);
    this.get_main_content = this.get_main_content.bind(this);
  }

  public render() {
    let button_options: LeftNavProps = this.get_left_nav_buttons();

    return (
      <div className="UserView">
        <UserHeader></UserHeader>
        <div className="page-content">
          <LeftNav options={button_options.options}></LeftNav>
          <div className="main-content">{this.get_main_content()}</div>
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    this.attempt_load_content(this.state.view);
  }

  public change_view(new_view: ViewType) {
    this.setState({ view: new_view }, () => {
      this.attempt_load_content(new_view);
    });
  }

  public update_logs_list(logs: LogData[]) {
    this.setState({ logs });
  }

  protected abstract attempt_load_content(view: ViewType): void;

  protected abstract get_left_nav_buttons(): LeftNavProps;

  protected abstract get_main_content(): JSX.Element;
}
