import { UserData } from "../../../../model/db/UserModel";

export interface SuccessfulLoginMsg {
  type: "SuccessfulLoginMsg";
  user_data: UserData;
}
