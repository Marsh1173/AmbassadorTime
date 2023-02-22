import { UserId } from "../../../model/db/UserModel";
import { ReturnMsg } from "../../utils/ReturnMsg";

export interface IAuthenticatedClientTracker {
  attempt_add_client(id: UserId): ReturnMsg;
  disconnect_authenticated_client(id: UserId): void;
}

export class AuthenticatedClientTracker implements IAuthenticatedClientTracker {
  private readonly authenticated_clients: Set<UserId> = new Set();

  public attempt_add_client(id: UserId): ReturnMsg {
    if (this.authenticated_clients.has(id)) {
      return { success: false, msg: "User is already logged in." };
    } else {
      this.authenticated_clients.add(id);
      return { success: true };
    }
  }

  public disconnect_authenticated_client(id: UserId): void {
    this.authenticated_clients.delete(id);
  }
}
