import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface DemoteLoggerAdminMsg extends MessageInterface {
  type: "DemoteLoggerAdminMsg";
  user_id: string;
}

export const DemoteLoggerAdminMsgSchema: BaseSchema = {
  type: "DemoteLoggerAdminMsg",
  fields: [
    {
      property_name: "user_id",
      property_type: "string",
      is_optional: false,
    },
  ],
};
