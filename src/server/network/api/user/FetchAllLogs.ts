import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface FetchAllLogsMsg extends MessageInterface {
  type: "FetchAllLogs";
}

export const FetchAllLogsMsgSchema: BaseSchema = {
  type: "FetchAllLogs",
};
