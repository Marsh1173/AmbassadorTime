import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface FetchLoggersMsg extends MessageInterface {
  type: "FetchLoggers";
}

export const FetchLoggersMsgSchema: BaseSchema = {
  type: "FetchLoggers",
};
