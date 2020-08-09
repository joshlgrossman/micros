import { Constructor } from '../internal';
import { InjectionToken } from './InjectionToken';

export type Provider<T> =
  | Constructor<T>
  | { token: InjectionToken<T>; useClass: Constructor<T> }
  | { token: InjectionToken<T>; useValue: T }
  | { token: InjectionToken<T>; useFactory: () => T };
