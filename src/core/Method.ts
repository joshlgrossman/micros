import { METHOD_METADATA_KEY } from "../internal";

export function Method(): <
  P extends string,
  C extends { [key in P]: (...args: any[]) => Promise<any> }
>(
  target: C,
  property: P,
  descriptor: TypedPropertyDescriptor<any>
) => TypedPropertyDescriptor<any> | void {
  return (target, property) => {
    const existingMethods: string[] =
      Reflect.getOwnMetadata(METHOD_METADATA_KEY, target) ?? [];

    Reflect.defineMetadata(
      METHOD_METADATA_KEY,
      [...existingMethods, property],
      target
    );
  };
}
