import { LocalStorage } from "../../../utils/LocalStorage";

export abstract class SaveSuccessfulLogin {
  public static save_successful_login(username: string, password: string) {
    LocalStorage.set_local_storage_item("login-username", username);
    LocalStorage.set_local_storage_item("login-password", password);
  }
}
