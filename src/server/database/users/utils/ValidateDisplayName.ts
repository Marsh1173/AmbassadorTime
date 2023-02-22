import { ReturnMsg } from "../../../utils/ReturnMsg";
import { DisplayNameMaxLength } from "../../../../model/db/UserModel";

export abstract class ValidateDisplayName {
  public static validate(display_name: string): ReturnMsg {
    if (display_name === "") {
      return { success: false, msg: "Display name cannot be empty" };
    } else if (display_name !== display_name.replace(ValidateDisplayName.letters_or_white_spaces_regex, "")) {
      return {
        success: false,
        msg: "Display name can only contain letters and spaces",
      };
    } else if (display_name.length > DisplayNameMaxLength) {
      return {
        success: false,
        msg: "Display name can only contain up to 30 characters.",
      };
    }

    return { success: true };
  }

  private static letters_or_white_spaces_regex: RegExp = /[^A-Za-z\s]/g;
}
