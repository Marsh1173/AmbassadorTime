import { assert } from "../../../../test/assert";
import { MsgParser } from "./MsgParser";
import { OptionSchema } from "./Schema";

const test_empty_schema: OptionSchema = [];

const test_schema: OptionSchema = [];

export const test_msg_parser = () => {
  for (const test of tests) {
    test();
  }
};

const tests: (() => void)[] = [
  () => {
    //empty schema
    assert(
      !MsgParser.parse_msg('{type: "test"}', test_empty_schema),
      "empty schema",
      "empty schema should return undefined"
    );
  },
  () => {
    //empty string
    assert(
      !MsgParser.parse_msg("", test_schema),
      "empty string",
      "empty string should return undefined"
    );
  },
  () => {
    //empty object
    assert(
      !MsgParser.parse_msg("{}", test_schema),
      "empty object",
      "empty object should return undefined"
    );
  },
  () => {
    //incomplete object
    assert(
      !MsgParser.parse_msg("{", test_schema),
      "incomplete object",
      "incomplete object should return undefined"
    );
  },
  () => {},
  () => {},
  () => {},
];
