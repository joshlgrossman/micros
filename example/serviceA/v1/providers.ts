import { InjectionToken, Provider } from '../../../src/di';
import { IServiceB } from '../../serviceB/v3/IServiceB';

export const SERVICE_B: InjectionToken<IServiceB> = 'SERVICE_B';
export const ServiceBProvider: Provider<IServiceB> = {
  token: SERVICE_B,
  useService: {
    name: 'ServiceB',
    version: 3,
  },
};
