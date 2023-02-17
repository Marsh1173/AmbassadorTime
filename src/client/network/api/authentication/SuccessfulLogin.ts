import { UserData } from "../../../../model/db/UserModel";

export interface SuccessfulLogin {
  type: "SuccessfulLogin";
  user_data: UserData;
}
