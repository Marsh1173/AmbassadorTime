import { UserData } from "../../../../model/db/UserModel";
import { ReturnMsg } from "../../../utils/ReturnMsg";
import { cannot_log_future_time } from "../LogDao";

export abstract class ValidateLog {
  public static validate_log(
    now_ms: number,
    target_date_time_ms: number,
    user_data: UserData
  ): ReturnMsg {
    if (now_ms < target_date_time_ms) {
      return { success: false, msg: cannot_log_future_time };
    }

    return { success: true };
  }
}
