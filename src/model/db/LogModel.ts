import { HasId, Id } from "../utils/Id";
import { UserData, UserId } from "./UserModel";

export type LogId = string;
export interface LogModel extends HasId {
  readonly id: LogId;
  readonly short_description: string;
  readonly target_date_time_ms: number;
  readonly minutes_logged: number;
  readonly time_logged_ms: number;
  readonly user_id: UserId;
}
