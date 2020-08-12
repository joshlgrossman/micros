import { ServiceA } from './ServiceA';
import { LoggerProvider } from '../../logger';
import { ServiceNode } from '../../../src/core';
import { ServiceBProvider } from './providers';

export default new ServiceNode({
  entrypoint: ServiceA,
  dependencies: [LoggerProvider, ServiceBProvider],
});
