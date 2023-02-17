import { LocalStorage } from "../../../utils/LocalStorage";

export class FetchStoredLogin {
  public static fetch(on_find: (username: string, password: string) => void) {
    let last_used_password: string | undefined =
      LocalStorage.get_local_storage_item("login-password");
    let last_used_username: string | undefined =
      LocalStorage.get_local_storage_item("login-username");

    if (last_used_password && last_used_username) {
      on_find(last_used_username, last_used_password);
    }
  }
}
