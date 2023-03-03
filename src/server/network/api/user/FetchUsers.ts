import { MessageInterface } from "../utils/msg/MessageInterface";
import { BaseSchema } from "../utils/parsing/Schema";

export interface FetchUsersMsg extends MessageInterface {
  type: "FetchUsers";
}

export const FetchUsersMsgSchema: BaseSchema = {
  type: "FetchUsers",
};
