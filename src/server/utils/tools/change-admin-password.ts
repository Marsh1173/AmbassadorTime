import { UserDao } from "../../database/users/UserDao";
import { DB } from "../../database/utils/DB";

const users_table_name: string = "users";
const admin_password: string | undefined = process.argv[2];

if (admin_password) {
  try {
    let db = DB.init();
    let user_dao: UserDao = new UserDao(db, users_table_name);

    const results = user_dao.change_user_password(admin_password, "Admin");
    if (results.success) {
      console.log("SUCCESS: Changed admin password to " + admin_password);
    } else {
      console.error("ERROR: " + results.msg);
    }
  } catch (err) {
    console.error(err);
  }
} else {
  console.error("ERROR: Usage: yarn change-admin-password <new password>");
}
