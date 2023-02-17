import { passed_failed } from "./assert";

export function log_test_output(
  msg: string,
  color: "pass" | "fail" | "normal"
) {
  let color_code: number = 90;
  switch (color) {
    case "fail":
      color_code = 31;
      break;
    case "pass":
      color_code = 32;
      break;
    case "normal":
      color_code = 90;
      break;
  }

  console.log("\u001b[" + color_code + "m" + msg + "\u001b[0m");
}

export const run_tests = async (tests_lambda: () => void, name: string) => {
  console.group("Testing " + name);
  try {
    await tests_lambda();
    log_test_output(
      `\nTests passed: ${passed_failed.passed}, tests failed: ${passed_failed.failed}`,
      passed_failed.failed === 0 ? "pass" : "fail"
    );
    console.groupEnd();
    log_test_output("All " + name + " tests have been run.", "normal");
  } catch (err: any) {
    console.error(err);
    console.groupEnd();
    log_test_output(
      `Critical error - could not finish testing ${name}`,
      "fail"
    );
  }
  passed_failed.failed = 0;
  passed_failed.passed = 0;
};
