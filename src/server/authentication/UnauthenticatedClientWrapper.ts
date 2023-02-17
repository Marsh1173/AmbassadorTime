import { UserData } from "../../model/db/UserModel";
import { AttemptLoginMsg } from "../network/api/authentication/AttemptLogin";
import {
  ClientMessage,
  ClientMessageNotImplemented,
} from "../network/api/ServerApi";
import { IClient } from "../network/client/Client";
import { ClientWrapper, IClientWrapper } from "../network/client/ClientWrapper";
import { IAuthenticationService } from "./AuthenticationService";
import { ValidateLoginReturnMsg } from "./ClientValidator";

export interface IUnauthenticatedClientWrapper extends IClientWrapper {}

export class UnauthenticatedClientWrapper
  extends ClientWrapper
  implements IUnauthenticatedClientWrapper
{
  constructor(
    private readonly auth_service: IAuthenticationService,
    client: IClient
  ) {
    super(client);
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

  public on_client_close(): void {
    this.auth_service.unauthenticated_client_tracker.disconnect_client(this.id);
  }

  private attempt_login(msg: AttemptLoginMsg) {
    let validation_results: ValidateLoginReturnMsg =
      this.auth_service.client_validator.attempt_validate_client_login(
        msg.user_id,
        msg.password
      );

    if (!validation_results.success) {
      this.send_unsuccessful_login(validation_results.msg);
    } else {
      this.send_successful_login(validation_results.user_data);
      this.auth_service.client_validator.on_successful_login(
        validation_results.user_data,
        this
      );
    }
  }

  private send_unsuccessful_login(msg: string) {
    this.send({
      type: "ServerAuthenticationMessage",
      msg: {
        type: "UnsuccessfulLogin",
        msg,
      },
    });
  }

  private send_successful_login(user_data: UserData) {
    this.send({
      type: "ServerAuthenticationMessage",
      msg: {
        type: "SuccessfulLogin",
        user_data,
      },
    });
  }
}
