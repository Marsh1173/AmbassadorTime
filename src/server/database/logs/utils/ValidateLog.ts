import { ReturnMsg } from "../../utils/Dao";

export abstract class ValidateLog {
  public static validate_log(
    now_ms: number,
    target_date_time_ms: number
  ): ReturnMsg {
    if (now_ms < target_date_time_ms) {
      return { success: false, msg: "Cannot log hours in the future" };
    }

    return { success: true };
  }
}
