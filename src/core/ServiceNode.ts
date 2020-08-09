import {
  Constructor,
  container,
  EFFECT_METADATA_KEY,
  SERVICE_METADATA_KEY,
} from "../internal";
import {
  Provider,
  InjectionToken,
  DEPENDENCY_CONTAINER,
  Registry,
} from "../di";
import {
  Protocol,
  ProtocolAdapterFactory,
  PROTOCOL_ADAPTER,
} from "../adapters";
import { MessageBroker } from "./MessageBroker";
import { Action } from "./Action";
import { NATS_PROTOCOL } from "../protocols";
import { RpcHandler } from "./RpcHandler";
import * as nats from "nats";

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
  private config = {
    protocol: Protocol.NATS,
  };

  public constructor(
    private readonly registry: {
      services: Constructor<any>[];
      entrypoint: InjectionToken;
      providers?: Provider<any>[];
    }
  ) {}

  public configure(config: any): this {
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

    for (const service of this.registry.services) {
      const serviceTokens: any[] =
        Reflect.getMetadata(SERVICE_METADATA_KEY, service) ?? [];

      if (!serviceTokens.includes(this.registry.entrypoint)) {
        for (const token of serviceTokens) {
          subContainer.register(token, {
            useFactory: () => rpcHandler.createRequestFacade(service),
          });
        }
      }
    }

    const service = subContainer.resolve(this.registry.entrypoint);

    rpcHandler.createReplyHandler(service);

    const registeredEffects: string[] =
      Reflect.getMetadata(EFFECT_METADATA_KEY, service) ?? [];

    for (const registeredEffect of registeredEffects) {
      service[registeredEffect].subscribe((action: Action) => {
        if (action) {
          broker.dispatch(action);
        }
      });
    }

    await service.started?.();
  }
}
