import { HasDBModelId } from "../utils/Dao";
import { DBBoolean } from "../utils/DBBoolean";

export type UserId = string;
export interface UserModel extends HasDBModelId<UserId> {
  id: UserId;
  displayname: string;
  password: string;
  salt: string;
  is_logger: DBBoolean;
  is_admin: DBBoolean;
}

export type UserData = Omit<UserModel, "password" | "salt">;

export const UsernameMaxLength: number = 30;
export const DisplayNameMaxLength: number = 30;
