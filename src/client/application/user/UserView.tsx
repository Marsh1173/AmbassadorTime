import { UserData } from "../../../model/db/UserModel";
import { IServerTalker } from "../../network/ServerTalker";
import { IClientApp } from "../ClientApp";

export interface UserViewProps {
  client_app: IClientApp;
  server_talker: IServerTalker;
  user_data: UserData;
}
