import { Id } from "../../../model/utils/Id";
import { ClientWrapper } from "./ClientWrapper";

export abstract class ClientMap<WrapperType extends ClientWrapper> {
  private readonly clients: Map<Id, WrapperType> = new Map();

  // public attach_client(wrapper_params: WrapperParams): WrapperType {
  //   let client_wrapper: WrapperType =
  //     this.create_client_wrapper(wrapper_params);
  //   this.clients.set(client_wrapper.id, client_wrapper);
  //   return client_wrapper;
  // }

  public disconnect_client(id: Id): void {
    this.clients.delete(id);
  }

  protected attach_client_to_map(client_wrapper: WrapperType) {
    this.clients.set(client_wrapper.id, client_wrapper);
  }

  // protected abstract create_client_wrapper(
  //   wrapper_params: WrapperParams
  // ): WrapperType;
}
