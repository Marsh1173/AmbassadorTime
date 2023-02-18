import { UserData } from "../../../../model/db/UserModel";

export interface AllLoggersMsg {
  type: "AllLoggersMsg";
  users: UserData[];
}
