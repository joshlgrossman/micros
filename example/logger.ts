import { InjectionToken } from '../src/di';

export const LOGGER: InjectionToken<Console> = Symbol('LOGGER');
export const LoggerProvider = {
  token: LOGGER,
  useValue: console,
};
