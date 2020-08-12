import { ON_START_METADATA_KEY } from '../internal';

export function OnStart(): <
  P extends string,
  C extends { [key in P]: (...args: any[]) => Promise<any> | void }
>(
  target: C,
  property: P,
  descriptor: TypedPropertyDescriptor<any>
) => TypedPropertyDescriptor<any> | void {
  return (target, property) => {
    Reflect.defineMetadata(ON_START_METADATA_KEY, property, target);
  };
}
