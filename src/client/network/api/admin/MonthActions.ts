import { UserData } from "../../../../model/db/UserModel";

export interface MonthActionsMsg {
  type: "MonthActionsMsg";
  data: string;
}
