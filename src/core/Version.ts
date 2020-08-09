import { InternalClassDecorator, VERSION_METADATA_KEY } from '../internal';

export function Version(version: number | string): InternalClassDecorator<any> {
  return (target) => {
    Reflect.defineMetadata(VERSION_METADATA_KEY, version, target);
  };
}
