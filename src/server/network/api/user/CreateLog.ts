import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface CreateLogMsg extends MessageInterface {
  type: "CreateLogMsg";
  short_description: string;
  target_date_time_ms: number;
  minutes_logged: number;
}

export const CreateLogMsgSchema: BaseSchema = {
  type: "CreateLogMsg",
  fields: [
    {
      property_name: "short_description",
      property_type: "string",
      is_optional: false,
    },
    {
      property_name: "target_date_time_ms",
      property_type: "number",
      is_optional: false,
    },
    {
      property_name: "minutes_logged",
      property_type: "number",
      is_optional: false,
    },
  ],
};
