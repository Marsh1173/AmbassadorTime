import { ReturnMsg } from "../../utils/Dao";
import { UsernameMaxLength } from "../../../../model/db/UserModel";

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
    } else if (user_id.length > UsernameMaxLength) {
      return {
        success: false,
        msg: "User id can only contain up to 30 characters.",
      };
    }

    return { success: true };
  }

  private static alphanumeric_regex: RegExp = /[^A-Za-z0-9]/g;
}
