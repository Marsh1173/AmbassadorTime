import { MessageInterface } from "../msg/MessageInterface";
import { OptionSchema, BaseSchema, FieldSchemas } from "./Schema";

export abstract class MsgParser {
  public static parse_msg<T extends MessageInterface>(
    json: string,
    schema: OptionSchema
  ): T | undefined {
    try {
      let parsed = JSON.parse(json);

      if (!MsgParser.is_object(parsed)) return undefined;
      let obj: Object = parsed;

      if (MsgParser.parse_option_msg(obj, schema)) {
        return obj as T;
      } else {
        return undefined;
      }
    } catch (er) {
      return undefined;
    }
  }

  private static parse_base_schema(obj: Object, schema: BaseSchema): boolean {
    if (schema.fields && !MsgParser.parse_fields(obj, schema.fields)) {
      return false;
    }

    if (schema.msg) {
      if (!("msg" in obj)) {
        return false;
      }
      let obj_msg: Object = (obj as { msg: any }).msg;
      if (!MsgParser.is_object(obj_msg)) {
        return false;
      } else if (!MsgParser.parse_option_msg(obj_msg, schema.msg)) {
        return false;
      }
    }

    if (schema.msgs) {
      if (!("msgs" in obj)) {
        return false;
      }
      let obj_msgs: Object = (obj as { msgs: any }).msgs;
      if (!MsgParser.is_object(obj_msgs)) {
        return false;
      } else {
        for (const msg of Object.values(obj_msgs)) {
          if (!MsgParser.is_object(msg)) {
            return false;
          }
          if (!MsgParser.parse_option_msg(msg, schema.msgs)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private static parse_option_msg(obj: Object, schema: OptionSchema): boolean {
    if (!("type" in obj)) {
      return false;
    }

    let option: BaseSchema | undefined = schema.find(
      (option) => option.type === (obj as { type: unknown }).type
    );
    if (option === undefined) {
      return false;
    }

    return MsgParser.parse_base_schema(obj, option);
  }

  private static parse_fields(
    obj: Object,
    schema_fields: FieldSchemas
  ): boolean {
    let obj_properties: Map<string, any> = new Map();
    Object.entries(obj).forEach((entry) => {
      obj_properties.set(entry[0], entry[1]);
    });
    for (const schema_field of schema_fields) {
      let obj_property: any | undefined = obj_properties.get(
        schema_field.property_name
      );
      if (
        schema_field.is_optional &&
        obj_property !== undefined &&
        schema_field.property_type !== typeof obj_property
      ) {
        return false;
      } else if (
        !schema_field.is_optional &&
        (obj_property === undefined ||
          (obj_property !== undefined &&
            schema_field.property_type !== typeof obj_property))
      ) {
        return false;
      }
    }
    return true;
  }

  private static is_object(val: any): val is Object {
    return typeof val === "object";
  }
}
