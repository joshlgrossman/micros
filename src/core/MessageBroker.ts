import { Inject } from "../di";
import { Action } from "./Action";
import { Observable, merge } from "rxjs";
import { PROTOCOL_ADAPTER, ProtocolAdapter } from "../adapters";
import { Singleton } from "../di";

@Singleton()
export class MessageBroker<A extends Action> {
  constructor(
    @Inject(PROTOCOL_ADAPTER) private readonly protocol: ProtocolAdapter
  ) {}

  public dispatch(action: A): void {
    this.protocol.publish(action);
  }

  public subscribe<T extends A["type"]>(
    ...types: T[]
  ): Observable<A & { type: T }> {
    return merge(...types.map((type) => this.protocol.subscribe(type))) as any;
  }
}
