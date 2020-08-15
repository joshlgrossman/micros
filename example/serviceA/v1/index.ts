import { ServiceA } from './ServiceA';
import { LoggerProvider } from '../../logger';
import { ServiceNode } from '../../../src/core';
import { ServiceBProvider } from './providers';

export default new ServiceNode({
  entrypoints: [ServiceA],
  dependencies: [LoggerProvider, ServiceBProvider],
});
