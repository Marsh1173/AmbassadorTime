import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface FetchUserLogsMsg extends MessageInterface {
  type: "FetchUserLogs";
}

export const FetchUserLogsMsgSchema: BaseSchema = {
  type: "FetchUserLogs",
};
