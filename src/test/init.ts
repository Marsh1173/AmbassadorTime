function log_test_output(msg: string, color: "pass" | "fail" | "normal") {
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

export function assert(condition: boolean, test_msg: string) {
  if (condition) {
    log_test_output("Test passed: " + test_msg, "pass");
  } else {
    log_test_output("Test failed: " + test_msg, "fail");
  }
}

function run_tests(tests_lambda: () => void, name: string) {
  console.group("Testing " + name);
  try {
    tests_lambda();
    console.groupEnd();
    log_test_output("All " + name + " tests have been run.", "normal");
  } catch (err: any) {
    console.log(err);
    console.groupEnd();
  }
}

console.group("Testing");
console.time("Time taken to run tests");

console.timeEnd("Time taken to run tests");
console.groupEnd();
