import { Inject, Injectable } from "../di";
import { PROTOCOL_ADAPTER, ProtocolAdapter } from "../adapters";
import { METHOD_METADATA_KEY, VERSION_METADATA_KEY } from "../internal";

@Injectable()
export class RpcHandler {
  constructor(
    @Inject(PROTOCOL_ADAPTER) private readonly protocol: ProtocolAdapter
  ) {}

  public createRequestFacade<T extends new () => any & { prototype: Function }>(
    service: T
  ): T {
    const registeredMethods: string[] =
      Reflect.getMetadata(METHOD_METADATA_KEY, service.prototype) ?? [];
    const registeredVersion: number | string =
      Reflect.getMetadata(VERSION_METADATA_KEY, service.prototype) ?? 0;

    const facade: any = {};

    for (const registeredMethod of registeredMethods) {
      facade[registeredMethod] = (...args: any[]) => {
        return this.protocol.request(
          `v${registeredVersion}.${service.name}.${registeredMethod}`,
          args
        );
      };
    }

    return facade;
  }

  public createReplyHandler<T extends object>(service: T): void {
    const registeredMethods: string[] =
      Reflect.getMetadata(METHOD_METADATA_KEY, service.constructor.prototype) ??
      [];
    const registeredVersion: number | string =
      Reflect.getMetadata(
        VERSION_METADATA_KEY,
        service.constructor.prototype
      ) ?? 0;

    for (const registeredMethod of registeredMethods) {
      this.protocol.respond(
        `v${registeredVersion}.${service.constructor.name}.${registeredMethod}`,
        (...args: any[]) => (service as any)[registeredMethod](...args)
      );
    }
  }
}
