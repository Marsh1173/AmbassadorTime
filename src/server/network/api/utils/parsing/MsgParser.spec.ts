import { assert } from "../../../../../test/assert";
import { MsgParser } from "./MsgParser";
import { OptionSchema } from "./Schema";

const test_empty_schema: OptionSchema = [];

const test_schema: OptionSchema = [
  {
    type: "BasicMessage",
    fields: [
      { property_name: "test1", property_type: "string", is_optional: false },
      { property_name: "test2", property_type: "number", is_optional: false },
    ],
  },
];

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
    assert(!MsgParser.parse_msg("", test_schema), "empty string", "empty string should return undefined");
  },
  () => {
    //empty object
    assert(!MsgParser.parse_msg("{}", test_schema), "empty object", "empty object should return undefined");
  },
  () => {
    //incomplete object
    assert(!MsgParser.parse_msg("{", test_schema), "incomplete object", "incomplete object should return undefined");
  },
  () => {
    let json_str_complete = JSON.stringify({
      type: "BasicMessage",
      test1: "hello",
      test2: 1,
    });
    let json_str_incomplete = JSON.stringify({
      type: "BasicMessage",
      test1: "hello",
    });
    //basic message
    assert(
      MsgParser.parse_msg(json_str_complete, test_schema) !== undefined,
      "basic message",
      "basic message should not return undefined"
    );
    assert(
      MsgParser.parse_msg(json_str_incomplete, test_schema) === undefined,
      "basic message incomplete",
      "basic message should return undefined"
    );
  },
  () => {
    const basic_schema_optional: OptionSchema = [
      {
        type: "BasicMessage",
        fields: [
          { property_name: "test1", property_type: "string", is_optional: false },
          { property_name: "test2", property_type: "number", is_optional: true },
        ],
      },
    ];
    let json_str_has_optional = JSON.stringify({
      type: "BasicMessage",
      test1: "hello",
      test2: 1,
    });
    let json_str_no_optional = JSON.stringify({
      type: "BasicMessage",
      test1: "hello",
    });
    //basic message w/ optional field
    assert(
      MsgParser.parse_msg(json_str_has_optional, basic_schema_optional) !== undefined,
      "basic message has optional field",
      "basic message should not return undefined"
    );
    assert(
      MsgParser.parse_msg(json_str_no_optional, basic_schema_optional) !== undefined,
      "basic message does not have optional field",
      "basic message should not return undefined"
    );
  },
];
