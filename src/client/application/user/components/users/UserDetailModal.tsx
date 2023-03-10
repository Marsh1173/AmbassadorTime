import React, { ChangeEvent, FormEvent } from "react";
import { Component } from "react";
import { UserPerms, UserTimeData } from "../../../../../model/db/UserModel";
import { Modal } from "../../../../view/components/Modal";
import { AdminServerTalkerWrapper } from "../../admin/AdminServerTalkerWrapper";
import { UserDetailView } from "./UserDetailView";
import { DeleteUserModal } from "./DeleteUserModal";
import { LogModel } from "../../../../../model/db/LogModel";

export interface UserDetailModalProps {
  admin_stw: AdminServerTalkerWrapper;
  logs: LogModel[];
}

interface UserDetailModalState {
  visible: boolean;
  selected_user: UserTimeData | undefined;
}

export class UserDetailModal extends Component<
  UserDetailModalProps,
  UserDetailModalState
> {
  private readonly delete_user_modal_ref: React.RefObject<DeleteUserModal> =
    React.createRef();
  constructor(props: UserDetailModalProps) {
    super(props);
    this.state = {
      visible: false,
      selected_user: undefined,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  private readonly DEFAULT_USER: JSX.Element = (<option value={""}></option>);

  public render() {
    return (
      <Modal visible={this.state.visible} on_close={this.hide}>
        <>
          <UserDetailView
            user_data={this.state.selected_user}
            logs={this.props.logs}
          >
            <hr />
            <div className="row">
              {this.state.selected_user &&
                this.state.selected_user.perms !== UserPerms.Admin && (
                  <button
                    className="delete"
                    onClick={() => {
                      this.delete_user_modal_ref.current?.show();
                    }}
                  >
                    Delete
                  </button>
                )}
              <button className="cancel" onClick={this.hide}>
                Close
              </button>
            </div>
          </UserDetailView>
          {this.state.selected_user && (
            <DeleteUserModal
              ref={this.delete_user_modal_ref}
              on_confirm={(user_id_to_delete: string, password: string) => {
                this.props.admin_stw.attempt_delete_user(
                  user_id_to_delete,
                  password
                );
                this.hide();
              }}
              user={this.state.selected_user}
            ></DeleteUserModal>
          )}
        </>
      </Modal>
    );
  }

  public show(user_data: UserTimeData) {
    this.setState({ visible: true, selected_user: user_data });
  }

  private hide() {
    this.setState({ visible: false, selected_user: undefined });
  }
}
