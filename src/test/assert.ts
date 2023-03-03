import { log_test_output } from "./utils";

export class CouldNotContinueError extends Error {}

export const passed_failed = {
  passed: 0,
  failed: 0,
};

export function assert(
  condition: boolean,
  test_name: string,
  test_msg: string
) {
  if (condition) {
    log_test_output("Test passed: " + test_name, "pass");
    passed_failed.passed += 1;
  } else {
    log_test_output("Test failed: " + test_name + " -> " + test_msg, "fail");
    passed_failed.failed += 1;
  }
}
