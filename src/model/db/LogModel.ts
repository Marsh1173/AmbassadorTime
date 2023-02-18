import { HasId, Id } from "../utils/Id";
import { UserId } from "./UserModel";

export type LogId = string;
export interface LogModel extends HasId {
  id: LogId;
  short_description: string;
  target_date_time_ms: number;
  minutes_logged: number;
  time_logged_ms: number;
  user_id: UserId;
}
