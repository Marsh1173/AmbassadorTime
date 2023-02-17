import { MessageInterface } from "../utils/MessageInterface";
import { BaseSchema } from "../utils/Schema";

export interface AttemptLoginMsg extends MessageInterface {
  type: "AttemptLoginMsg";
  user_id: string;
  password: string;
}

export const AttemptLoginMsgSchema: BaseSchema = {
  type: "AttemptLoginMsg",
  fields: [
    {
      property_name: "user_id",
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
