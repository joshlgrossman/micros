import {
  container,
  EFFECT_METADATA_KEY,
  VERSION_METADATA_KEY,
  ON_START_METADATA_KEY,
  SERVICE_METADATA_KEY,
  Constructor,
} from '../internal';
import { Provider, DEPENDENCY_CONTAINER, Registry } from '../di';
import {
  Protocol,
  ProtocolAdapterFactory,
  PROTOCOL_ADAPTER,
} from '../adapters';
import { MessageBroker } from './MessageBroker';
import { Action } from './Action';
import { NATS_PROTOCOL } from '../protocols';
import { RpcHandler } from './RpcHandler';
import * as nats from 'nats';
import { ServiceNodeConfig } from './ServiceNodeConfig';

@Registry([
  {
    token: DEPENDENCY_CONTAINER,
    useValue: container,
  },
  {
    token: NATS_PROTOCOL,
    useFactory: () => nats,
  },
])
export class ServiceNode {
  private config: ServiceNodeConfig = {
    protocol: {
      type: Protocol.NATS,
      json: true,
      servers: ['nats://localhost:4222'],
      timeout: 2000,
      maxRetries: 0,
    },
  };

  public constructor(
    private readonly registry: {
      entrypoints: Constructor<any>[];
      dependencies?: Provider<any>[];
    }
  ) {}

  public configure(config: ServiceNodeConfig): this {
    this.config = config;
    return this;
  }

  public async start(): Promise<void> {
    const subContainer = container.createChildContainer();
    const protocolAdapterFactory = subContainer.resolve(ProtocolAdapterFactory);
    const protocolAdapter = protocolAdapterFactory.create(this.config.protocol);

    subContainer.register(PROTOCOL_ADAPTER, { useValue: protocolAdapter });

    await protocolAdapter.connect();

    const broker = subContainer.resolve(MessageBroker);
    const rpcHandler = subContainer.resolve(RpcHandler);

    for (const dependency of this.registry.dependencies ?? []) {
      if (typeof dependency === 'function') {
        if (Reflect.hasMetadata(SERVICE_METADATA_KEY, dependency)) {
          const registeredVersion: number | string =
            Reflect.getMetadata(VERSION_METADATA_KEY, dependency.prototype) ??
            0;

          subContainer.register(dependency, {
            useFactory: () =>
              rpcHandler.createRequestFacade({
                name: dependency.name,
                version: registeredVersion,
              }),
          });
        } else {
          subContainer.register(dependency, dependency);
        }
      } else if ('useService' in dependency) {
        subContainer.register(dependency.token, {
          useFactory: () =>
            rpcHandler.createRequestFacade(dependency.useService),
        });
      } else {
        subContainer.register(dependency.token, dependency as any);
      }
    }

    const onStartPromises = [];
    for (const entrypoint of this.registry.entrypoints) {
      const service = subContainer.resolve(entrypoint);
      const onStart: string = Reflect.getMetadata(
        ON_START_METADATA_KEY,
        service.constructor.prototype
      );

      rpcHandler.registerReplySubscriptions(service);

      const registeredEffects: string[] =
        Reflect.getMetadata(EFFECT_METADATA_KEY, service) ?? [];

      for (const registeredEffect of registeredEffects) {
        service[registeredEffect].subscribe((action: Action) => {
          if (action) {
            broker.dispatch(action);
          }
        });
      }

      if (onStart) {
        onStartPromises.push(service[onStart]());
      }
    }

    await Promise.all(onStartPromises);
  }
}
