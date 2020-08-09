// import 'reflect-metadata';
import { ServiceNode } from '../src/core';
import { ServiceA } from './ServiceA';
import { ServiceB } from './ServiceB';
import { LoggerProvider } from './logger';

new ServiceNode({
  services: [ServiceA, ServiceB],
  providers: [LoggerProvider],
  entrypoint: ServiceB,
})
  .configure({})
  .start()
  .catch(console.log);

new ServiceNode({
  services: [ServiceA, ServiceB],
  providers: [LoggerProvider],
  entrypoint: ServiceB,
})
  .configure({})
  .start()
  .catch(console.log);

new ServiceNode({
  services: [ServiceA, ServiceB],
  providers: [LoggerProvider],
  entrypoint: ServiceA,
})
  .configure({})
  .start()
  .catch(console.log);
