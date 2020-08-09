import 'reflect-metadata';
import { ServiceNode } from '../src/core';
import { ServiceAImpl } from './serviceA/ServiceAImpl';
import { ServiceBImpl } from './serviceB/ServiceBImpl';
import { LoggerProvider } from './logger';

new ServiceNode({
  services: [ServiceAImpl, ServiceBImpl],
  providers: [LoggerProvider],
  entrypoint: ServiceBImpl,
})
  .start()
  .catch(console.log);

new ServiceNode({
  services: [ServiceAImpl, ServiceBImpl],
  providers: [LoggerProvider],
  entrypoint: ServiceBImpl,
})
  .start()
  .catch(console.log);

new ServiceNode({
  services: [ServiceAImpl, ServiceBImpl],
  providers: [LoggerProvider],
  entrypoint: ServiceAImpl,
})
  .start()
  .catch(console.log);
