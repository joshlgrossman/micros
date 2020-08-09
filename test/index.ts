import "reflect-metadata";
import { ServiceNode } from "../src/core";
import { ServiceA } from "./ServiceA";
import { ServiceB } from "./ServiceB";

new ServiceNode({
  services: [ServiceA, ServiceB],
  entrypoint: ServiceB,
})
  .configure({})
  .start()
  .catch(console.log);

new ServiceNode({
  services: [ServiceA, ServiceB],
  entrypoint: ServiceA,
})
  .configure({})
  .start()
  .catch(console.log);
