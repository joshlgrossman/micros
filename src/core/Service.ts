import { InjectionToken, Injectable } from '../di';
import {
  container,
  InternalClassDecorator,
  SERVICE_METADATA_KEY,
} from '../internal';

export function Service<T = any>(
  token?: InjectionToken<T>
): InternalClassDecorator<T> {
  return (target) => {
    Reflect.defineMetadata(
      SERVICE_METADATA_KEY,
      [token ?? target.name, target],
      target
    );

    container.register(token ?? target.name, { useClass: target });
    return Injectable()(target);
  };
}
