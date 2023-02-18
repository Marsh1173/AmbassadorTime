import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface FetchActionLogMsg extends MessageInterface {
  type: "FetchActionLogMsg";
  month: string;
  year: string;
}

export const FetchActionLogMsgSchema: BaseSchema = {
  type: "FetchActionLogMsg",
  fields: [
    {
      property_name: "month",
      property_type: "string",
      is_optional: false,
    },
    {
      property_name: "year",
      property_type: "string",
      is_optional: false,
    },
  ],
};
