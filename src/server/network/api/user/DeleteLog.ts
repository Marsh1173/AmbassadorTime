import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface DeleteLogMsg extends MessageInterface {
  type: "DeleteLogMsg";
  log_id_to_delete: string;
}

export const DeleteLogMsgSchema: BaseSchema = {
  type: "DeleteLogMsg",
  fields: [
    {
      property_name: "log_id_to_delete",
      property_type: "string",
      is_optional: false,
    },
  ],
};
