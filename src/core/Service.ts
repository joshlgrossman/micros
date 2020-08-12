import { Injectable } from '../di';
import { InternalClassDecorator, SERVICE_METADATA_KEY } from '../internal';

export function Service<T = any>(): InternalClassDecorator<T> {
  return (target) => {
    Reflect.defineMetadata(SERVICE_METADATA_KEY, true, target);
    return Injectable()(target);
  };
}
