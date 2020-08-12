import { Gateway } from './Gateway';
import { LoggerProvider } from '../../logger';
import { ServiceNode } from '../../../src/core';
import { ServiceAProvider, ServiceBProvider } from './providers';

export default new ServiceNode({
  entrypoint: Gateway,
  dependencies: [LoggerProvider, ServiceAProvider, ServiceBProvider],
});
