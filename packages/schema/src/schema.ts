// @ts-ignore
import * as asn1 from "asn1js";
import { AsnRepeatType } from "./decorators";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnConverter, IEmptyConstructor, IAsnConvertible } from "./types";
import { isConvertible } from "./helper";

export interface IAsnSchemaItem {
  type: AsnPropTypes | IEmptyConstructor<any>;
  optional?: boolean;
  defaultValue?: any;
  context?: number;
  implicit?: boolean;
  converter?: IAsnConverter;
  repeated?: AsnRepeatType;
}

export interface IAsnSchema {
  type: AsnTypeTypes;
  itemType: AsnPropTypes | IEmptyConstructor<any>;
  items: { [key: string]: IAsnSchemaItem };
  schema?: any;
}

export class AsnSchemaStorage {
  protected items = new WeakMap<object, IAsnSchema>();

  public has(target: object) {
    return this.items.has(target);
  }

  public get(target: object) {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error(`Cannot get schema for '${(target as any)?.prototype?.constructor?.name ?? target}' target`);
    }
    return schema;
  }

  public cache(target: object) {
    const schema = this.get(target);
    if (!schema.schema) {
      schema.schema = this.create(target, true);
    }
  }

  public createDefault(target: object) {
    // Initialize default ASN1 schema
    const schema = {
      type: AsnTypeTypes.Sequence,
      items: {},
    } as IAsnSchema;

    // Get and assign schema from parent
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
    }

    return schema;
  }

  public create(target: object, useNames: boolean) {
    const schema = this.items.get(target) || this.createDefault(target);

    const asn1Value = [];
    for (const key in schema.items) {
      const item = schema.items[key];
      const name = useNames ? key : "";
      let asn1Item: any;
      if (typeof (item.type) === "number") {
        // type is AsnPropType Enum
        const Asn1TypeName = AsnPropTypes[item.type];
        const Asn1Type = (asn1 as any)[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
        }
        asn1Item = new Asn1Type({ name });
      } else if (isConvertible(item.type)) {
        const instance: IAsnConvertible = new item.type();
        asn1Item = instance.toSchema(name);
      } else {
        // type is class with schema
        // asn1Item = createAsn1Schema(item.type, schema.type === Asn1TypeType.Choice ? true : false);
        asn1Item = new asn1.Any({ name });
        // asn1Item.name = name;
      }
      const optional = !!item.optional || item.defaultValue !== undefined;
      if (item.repeated) {
        asn1Item.name = "";
        const Container = item.repeated === "set"
          ? asn1.Set
          : asn1.Sequence;
        asn1Item = new Container({
          name: "",
          value: [
            new asn1.Repeated({
              name,
              value: asn1Item,
            }),
          ],
        } as any);
      }
      if (item.context !== null && item.context !== undefined) {
        // CONTEXT-SPECIFIC
        if (item.implicit) {
          // IMPLICIT
          if (typeof item.type === "number" || isConvertible(item.type)) {
            const Container = item.repeated
              ? asn1.Constructed
              : asn1.Primitive;
            asn1Value.push(new Container({
              name,
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
            } as any));
          } else {
            this.cache(item.type);
            const isRepeated = !!item.repeated;
            let value = !isRepeated
              ? this.get(item.type).schema
              : asn1Item;
            value = value.valueBlock ? value.valueBlock.value : value.value;
            asn1Value.push(new asn1.Constructed({
              name: !isRepeated ? name : "",
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
              value,
            } as any));
          }
        } else {
          // EXPLICIT
          asn1Value.push(new asn1.Constructed({
            optional,
            idBlock: {
              tagClass: 3,
              tagNumber: item.context,
            },
            value: [asn1Item],
          } as any));
        }
      } else {
        // UNIVERSAL
        asn1Item.optional = optional;
        asn1Value.push(asn1Item);
      }
    }

    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        return new asn1.Sequence({ value: asn1Value, name: "" } as any);
      case AsnTypeTypes.Set:
        return new asn1.Set({ value: asn1Value, name: "" } as any);
      case AsnTypeTypes.Choice:
        return new asn1.Choice({ value: asn1Value, name: "" } as any);
      default:
        throw new Error(`Unsupported ASN1 type in use`);
    }
  }

  public set(target: object, schema: IAsnSchema) {
    this.items.set(target, schema);
    return this;
  }

  protected findParentSchema(target: object): IAsnSchema | null {
    const parent = (target as any).__proto__;
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }

}
