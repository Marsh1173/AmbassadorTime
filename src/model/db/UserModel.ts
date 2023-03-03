import { HasDBModelId } from "./HasDbModelId";

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
  time: number;
}

export const UsernameMaxLength: number = 30;
export const DisplayNameMaxLength: number = 30;
