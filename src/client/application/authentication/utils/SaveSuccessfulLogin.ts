import { LocalStorage } from "../../../utils/LocalStorage";

export abstract class SaveSuccessfulLogin {
  public static save_successful_login(username: string) {
    LocalStorage.set_local_storage_item("login-username", username);
  }
}
