import { HasDBModelId } from "./HasDbModelId";
import { LogModel } from "./LogModel";

export enum UserPerms {
  Admin = "admin",
  Logger = "logger",
}

export type UserId = string;
export interface UserModel extends HasDBModelId<UserId> {
  readonly id: UserId;
  readonly displayname: string;
  readonly password: string;
  readonly salt: string;
  readonly perms: UserPerms;
}

export type UserData = Omit<UserModel, "password" | "salt">;
export interface UserTimeData extends UserData {
  /**
   * Time logged in minutes.
   */
  total_time: number;
}

export abstract class UserModel {
  public static readonly UsernameMaxLength: number = 30;
  public static readonly DisplayNameMaxLength: number = 30;
  public static readonly InitialPassword: string = "password";

  public static FillTotalTime(user: UserData, logs: LogModel[], month: number): UserTimeData {
    const user_logs: LogModel[] = logs.filter((log) => log.user_id === user.id);
    console.log("FillTotalTime");
    console.log("user_logs length: " + user_logs.length);

    return {
      ...user,
      total_time: user_logs.reduce((sum, log) => sum + log.minutes_logged, 0),
    };
  }

  public static GetMonthTime(user: UserData, logs: LogModel[], month: number, year: number): number {
    const user_logs: LogModel[] = logs.filter((log) => log.user_id === user.id);
    const user_logs_this_month: LogModel[] = user_logs.filter((log) => {
      const date = new Date(log.target_date_time_ms);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    console.log("GetMonthTime");
    console.log("user_logs length: " + user_logs.length);
    console.log("user_logs_this_month length: " + user_logs_this_month.length);

    return user_logs_this_month.reduce((sum, log) => sum + log.minutes_logged, 0);
  }
}
