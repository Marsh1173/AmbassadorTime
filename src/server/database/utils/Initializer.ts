import Sqlite3 from "better-sqlite3";
import { Logger } from "../../logging/Logger";

const initDB = async () => {
  let db = await new Sqlite3("src/server/database/sqlite/test.db", {
    fileMustExist: true,
    verbose: Logger.log_db,
  });
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = 1");
  db.pragma("foreign_keys = ON");

  try {
    db.prepare("drop table users").run();
  } catch {}

  const statement = db.prepare(
    "CREATE TABLE `users` (`id` VARCHAR(30) PRIMARY KEY NOT NULL,`displayname` VARCHAR(30) NOT NULL,`password` VARCHAR(32) NOT NULL,`salt` VARCHAR(32) NOT NULL,`is_logger` BOOLEAN NOT NULL,`is_admin` BOOLEAN NOT NULL);"
  );

  statement.run();

  db.prepare(
    "INSERT INTO users (id, displayname, password, is_logger, is_admin) VALUES ('nhr2000', 'Nate Roylance', 'password', 'true', 'false');"
  ).run();

  db.prepare(
    "INSERT INTO users (id, displayname, password, is_logger, is_admin) VALUES ('amh2002', 'Alyssa Habel', 'password', 'false', 'true');"
  ).run();

  console.log(db.prepare("select * from users;").all());

  try {
    db.prepare(
      "INSERT INTO users (id, displayname, password, is_logger, is_admin) VALUES ('amh2002', 'Alyssa Habel', 'password', 'false', 'true');"
    ).run();
  } catch (e: unknown) {
    if (typeof e === "string") {
      console.log(e.toUpperCase());
    } else if (e instanceof Sqlite3.SqliteError) {
      console.log(e.code);
    } else if (e instanceof Error) {
      console.log(e.message);
    }
  }
};
