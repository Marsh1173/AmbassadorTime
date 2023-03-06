import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface DeleteLoggerMsg extends MessageInterface {
  type: "DeleteLoggerMsg";
  user_id_to_delete: string;
  password: string;
}

export const DeleteLoggerMsgSchema: BaseSchema = {
  type: "DeleteLoggerMsg",
  fields: [
    {
      property_name: "user_id_to_delete",
      property_type: "string",
      is_optional: false,
    },
    {
      property_name: "password",
      property_type: "string",
      is_optional: false,
    },
  ],
};
