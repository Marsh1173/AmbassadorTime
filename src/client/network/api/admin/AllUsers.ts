import { UserData } from "../../../../model/db/UserModel";

export interface AllUsersMsg {
  type: "AllUsersMsg";
  users: UserData[];
}
