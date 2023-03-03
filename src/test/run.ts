import { test_log_database } from "../server/database/logs/LogDao.spec";
import { test_user_database } from "../server/database/users/UserDao.spec";
import { test_msg_parser } from "../server/network/api/utils/parsing/MsgParser.spec";
import { log_test_output, run_test_group } from "./utils";

const tests: (() => Promise<boolean>)[] = [
  () => {
    return run_test_group(test_user_database, "User Database");
  },
  () => {
    return run_test_group(test_log_database, "Log Database");
  },
  // () => {
  //   return run_test_group(test_msg_parser, "Message Parser");
  // },
];

const run_tests = async () => {
  console.group("Testing");
  console.time("Time taken to run tests");

  let some_failed: boolean = false;
  for (const test of tests) {
    let results: boolean = await test();
    if (!results) some_failed = true;
  }

  console.timeEnd("Time taken to run tests");
  if (some_failed) {
    log_test_output("Not all tests passed.", "fail");
  } else {
    log_test_output("All tests passed.", "pass");
  }
  console.groupEnd();
};

run_tests();
