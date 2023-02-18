import { UserData } from "../../../model/db/UserModel";
import { AttemptLoginMsg } from "../../network/api/authentication/AttemptLogin";
import { ClientMessage, ClientMessageNotImplemented } from "../../network/api/ServerApi";
import { IClient } from "../../network/client/Client";
import { ClientWrapper } from "../../network/client/ClientWrapper";
import { IAuthenticationService } from "../AuthenticationService";
import { ValidateLoginReturnMsg } from "../utils/ClientValidator";
import { UnauthenticatedClientMap } from "./UnauthenticatedClientMap";

export class UnauthenticatedClientWrapper extends ClientWrapper {
  constructor(
    private readonly auth_service: IAuthenticationService,
    client: IClient,
    client_map: UnauthenticatedClientMap
  ) {
    super(client, client_map);
  }

  public receive_message(msg: ClientMessage, client_id: string): void {
    if (msg.type !== "ClientAuthenticationMessage") {
      return;
    }

    switch (msg.msg.type) {
      case "AttemptLoginMsg":
        this.attempt_login(msg.msg);
        break;
      default:
        throw new ClientMessageNotImplemented(msg);
    }
  }

  protected log_disconnection(): void {
    console.log("Disconnected from unauthenticated client " + this.id);
  }

  private attempt_login(msg: AttemptLoginMsg) {
    let validation_results: ValidateLoginReturnMsg = this.auth_service.client_validator.attempt_validate_client_login(
      msg.user_id,
      msg.password
    );

    if (!validation_results.success) {
      this.send_unsuccessful_login(validation_results.msg);
      return;
    }

    console.log("Successfully authenticated user " + validation_results.user_data.displayname);
    this.send_successful_login(validation_results.user_data);

    let client: IClient = this.deconstruct();
    this.auth_service.server_app.user_service.user_client_map.attach_client(client, validation_results.user_data);
  }

  private send_unsuccessful_login(msg: string) {
    this.send({
      type: "ServerAuthenticationMessage",
      msg: {
        type: "FailureMsg",
        msg,
      },
    });
  }

  private send_successful_login(user_data: UserData) {
    this.send({
      type: "ServerAuthenticationMessage",
      msg: {
        type: "SuccessfulLoginMsg",
        user_data,
      },
    });
  }
}
