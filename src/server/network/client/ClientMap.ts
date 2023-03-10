import { UserId } from "../../../model/db/UserModel";
import { Id } from "../../../model/utils/Id";
import { ClientWrapper } from "./ClientWrapper";

export abstract class ClientMap<WrapperType extends ClientWrapper> {
  private readonly clients: Map<Id, WrapperType> = new Map();

  public disconnect_client(id: Id): void {
    this.clients.delete(id);
  }

  protected attach_client_to_map(client_wrapper: WrapperType) {
    this.clients.set(client_wrapper.id, client_wrapper);
  }

  protected get_client(
    f: (client: WrapperType) => boolean
  ): WrapperType | undefined {
    return Array.from(this.clients).find(([id, client]) => f(client))?.[1];
  }
}
