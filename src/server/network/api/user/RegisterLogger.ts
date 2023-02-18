import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface RegisterLoggerMsg extends MessageInterface {
  type: "RegisterLoggerMsg";
  user_id: string;
  display_name: string;
}

export const RegisterLoggerMsgSchema: BaseSchema = {
  type: "RegisterLoggerMsg",
  fields: [
    {
      property_name: "user_id",
      property_type: "string",
      is_optional: false,
    },
    {
      property_name: "display_name",
      property_type: "string",
      is_optional: false,
    },
  ],
};
