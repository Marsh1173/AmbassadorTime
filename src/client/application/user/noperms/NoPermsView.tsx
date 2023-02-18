import React from "react";
import { Component } from "react";
import { UserHeader } from "../components/UserHeader";

export class NoPermsView extends Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="NoPermsView">
        <UserHeader></UserHeader>
        <div className="page-content">
          <span>You don't have any permissions. Please contact your admins.</span>
        </div>
      </div>
    );
  }
}
