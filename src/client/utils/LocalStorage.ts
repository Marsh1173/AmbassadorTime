type LocalStorageKey = "login-username";

export class LocalStorage {
  public static get_local_storage_item<IData>(key: LocalStorageKey): IData | undefined {
    let json_data: string | null = localStorage.getItem(key);
    if (json_data === null) {
      return undefined;
    } else {
      try {
        let data: IData = JSON.parse(json_data);
        return data;
      } catch {
        return undefined;
      }
    }
  }

  public static set_local_storage_item(key: LocalStorageKey, data: any) {
    let json_string: string = JSON.stringify(data);
    localStorage.setItem(key, json_string);
  }
}
