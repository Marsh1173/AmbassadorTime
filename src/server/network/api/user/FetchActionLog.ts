import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface FetchActionLogMsg extends MessageInterface {
  type: "FetchActionLogMsg";
  month: number;
  year: number;
}

export const FetchActionLogMsgSchema: BaseSchema = {
  type: "FetchActionLogMsg",
  fields: [
    {
      property_name: "month",
      property_type: "number",
      is_optional: false,
    },
    {
      property_name: "year",
      property_type: "number",
      is_optional: false,
    },
  ],
};
