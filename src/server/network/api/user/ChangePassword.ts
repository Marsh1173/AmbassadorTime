import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface ChangePasswordMsg extends MessageInterface {
  type: "ChangePasswordMsg";
  old_password: string;
  new_password: string;
}

export const ChangePasswordMsgSchema: BaseSchema = {
  type: "ChangePasswordMsg",
  fields: [
    {
      property_name: "old_password",
      property_type: "string",
      is_optional: false,
    },
    {
      property_name: "new_password",
      property_type: "string",
      is_optional: false,
    },
  ],
};
