import { ReturnMsg } from "../../utils/Dao";

let crypto = require("crypto");
const hash = crypto.createHash("sha256");

export interface HashAndSalt {
  hash: string;
  salt: string;
}

export abstract class PasswordService {
  public static hash_password(password: string): HashAndSalt {
    let salt = crypto.randomBytes(16).toString("hex");
    let hash = crypto
      .pbkdf2Sync(password, salt, 1000, 16, `sha512`)
      .toString(`hex`);
    return {
      hash,
      salt,
    };
  }

  public static check_password(
    password_attempt: string,
    data: HashAndSalt
  ): boolean {
    let hash = crypto
      .pbkdf2Sync(password_attempt, data.salt, 1000, 16, `sha512`)
      .toString(`hex`);
    return hash === data.hash;
  }

  public static validate_new_password(new_password: string): ReturnMsg {
    if (new_password === "") {
      return { success: false, msg: "New password cannot be empty" };
    } else if (
      new_password !== new_password.replace(PasswordService.no_white_space, "")
    ) {
      return {
        success: false,
        msg: "Password cannot contain spaces",
      };
    }

    return { success: true };
  }

  private static no_white_space: RegExp = /\s+/g;
}
