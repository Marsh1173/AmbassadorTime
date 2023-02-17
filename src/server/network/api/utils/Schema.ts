export type DataFieldType = "string" | "number";
export type OptionSchema = BaseSchema[];
export type FieldSchemas = {
  property_name: string;
  property_type: DataFieldType;
  is_optional: boolean;
}[];

export interface BaseSchema {
  type: string;
  fields?: FieldSchemas;
  msgs?: OptionSchema;
  msg?: OptionSchema;
}
