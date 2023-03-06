import { ReturnMsg } from "../../../utils/ReturnMsg";
import { UserModel } from "../../../../model/db/UserModel";

export abstract class ValidateUserId {
  public static validate(user_id: string): ReturnMsg {
    if (user_id === "") {
      return { success: false, msg: "User id cannot be nothing" };
    } else if (
      user_id !== user_id.replace(ValidateUserId.alphanumeric_regex, "")
    ) {
      return {
        success: false,
        msg: "User id can only contain letters and numbers",
      };
    } else if (user_id.length > UserModel.UsernameMaxLength) {
      return {
        success: false,
        msg: "User id can only contain up to 30 characters.",
      };
    }

    return { success: true };
  }

  private static alphanumeric_regex: RegExp = /[^A-Za-z0-9]/g;
}
