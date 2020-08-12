import { ServiceB } from './ServiceB';
import { LoggerProvider } from '../../logger';
import { ServiceNode } from '../../../src/core';

export default new ServiceNode({
  dependencies: [LoggerProvider],
  entrypoint: ServiceB,
});
