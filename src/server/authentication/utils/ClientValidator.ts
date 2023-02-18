import { UserData } from "../../../model/db/UserModel";
import { FailureMsg, ReturnMsg, SuccessMsg } from "../../database/utils/Dao";
import { IAuthenticationService } from "../AuthenticationService";

export interface ValidateLoginSuccess extends SuccessMsg {
  user_data: UserData;
}
export type ValidateLoginReturnMsg = FailureMsg | ValidateLoginSuccess;

export interface IClientValidator {
  attempt_validate_client_login(
    user_id: string,
    password: string
  ): ValidateLoginReturnMsg;
}

export class ClientValidator implements IClientValidator {
  constructor(private readonly auth_service: IAuthenticationService) {}

  public attempt_validate_client_login(
    user_id: string,
    password: string
  ): ValidateLoginReturnMsg {
    //validate user id and password
    let validate_user_id_and_password: ValidateLoginReturnMsg =
      this.auth_service.server_app.user_dao.validate_login({
        id: user_id,
        password,
      });
    if (!validate_user_id_and_password.success) {
      return validate_user_id_and_password;
    }

    //check if user is already logged in
    let already_logged_in: ReturnMsg =
      this.auth_service.authenticated_client_tracker.attempt_add_client(
        user_id
      );
    if (!already_logged_in.success) {
      return already_logged_in;
    }

    return validate_user_id_and_password;
  }
}
