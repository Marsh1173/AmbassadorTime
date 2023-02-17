import { test_user_database } from "../server/database/users/UserDao.spec";
import { test_msg_parser } from "../server/network/api/utils/MsgParser.spec";
import { run_tests } from "./utils";

const test = async () => {
  console.group("Testing");
  console.time("Time taken to run tests");

  await run_tests(test_user_database, "User Database");
  await run_tests(test_msg_parser, "Message Parser");

  console.timeEnd("Time taken to run tests");
  console.groupEnd();
};

test();
