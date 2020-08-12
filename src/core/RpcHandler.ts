import { Inject, Singleton } from '../di';
import { PROTOCOL_ADAPTER, ProtocolAdapter } from '../adapters';
import {
  METHOD_METADATA_KEY,
  VERSION_METADATA_KEY,
  ServiceFacade,
} from '../internal';

@Singleton()
export class RpcHandler {
  constructor(
    @Inject(PROTOCOL_ADAPTER) private readonly protocol: ProtocolAdapter
  ) {}

  public createRequestFacade(serviceIdentifier: {
    name: string;
    version: number | string;
  }): ServiceFacade {
    return new Proxy(
      {},
      {
        get: (target, property) => (...args: any[]) =>
          this.protocol.request(
            `${serviceIdentifier.name}.v${serviceIdentifier.version}.${String(
              property
            )}`,
            args
          ),
      }
    );
  }

  public registerReplySubscriptions<T extends Record<string, unknown>>(
    service: T
  ): void {
    const registeredMethods: string[] =
      Reflect.getMetadata(METHOD_METADATA_KEY, service.constructor.prototype) ??
      [];

    const registeredVersion: number | string =
      Reflect.getMetadata(VERSION_METADATA_KEY, service.constructor) ?? 0;

    for (const registeredMethod of registeredMethods) {
      this.protocol.reply(
        `${service.constructor.name}.v${registeredVersion}.${registeredMethod}`,
        (...args: any[]) => (service as any)[registeredMethod](...args)
      );
    }
  }
}
