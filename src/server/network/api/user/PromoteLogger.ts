import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface PromoteLoggerMsg extends MessageInterface {
  type: "PromoteLoggerMsg";
  user_id: string;
}

export const PromoteLoggerMsgSchema: BaseSchema = {
  type: "PromoteLoggerMsg",
  fields: [
    {
      property_name: "user_id",
      property_type: "string",
      is_optional: false,
    },
  ],
};
