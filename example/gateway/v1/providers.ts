import { InjectionToken, Provider } from '../../../src/di';
import { IServiceA } from '../../serviceA/v1/IServiceA';
import { IServiceB } from '../../serviceB/v3/IServiceB';

export const SERVICE_A: InjectionToken<IServiceA> = 'SERVICE_A';
export const ServiceAProvider: Provider<IServiceA> = {
  token: SERVICE_A,
  useService: {
    name: 'ServiceA',
    version: 1,
  },
};

export const SERVICE_B: InjectionToken<IServiceB> = 'SERVICE_B';
export const ServiceBProvider: Provider<IServiceB> = {
  token: SERVICE_B,
  useService: {
    name: 'ServiceB',
    version: 3,
  },
};
