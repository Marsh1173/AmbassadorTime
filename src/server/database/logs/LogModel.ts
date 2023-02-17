import { HasId, Id } from "../../../model/utils/Id";
import { UserId } from "../users/UserModel";

export type LogId = string;
export interface LogModel extends HasId {
  id: LogId;
  short_description: string;
  target_date_time_ms: number;
  minutes_logged: number;
  time_logged_ms: number;
  user_id: UserId;
}
