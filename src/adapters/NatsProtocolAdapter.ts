import { Observable } from "rxjs";
import { ProtocolAdapter } from "./ProtocolAdapter";
import { Injectable, Inject, Singleton } from "../di";
import { NATS_PROTOCOL, nats } from "../protocols";
import { Action } from "../core";
import { Protocol } from "./Protocol";

@Singleton()
export class NatsProtocolAdapter implements ProtocolAdapter {
  public readonly type = Protocol.NATS;
  private connection!: nats.Client;

  constructor(@Inject(NATS_PROTOCOL) private readonly protocol: typeof nats) {}

  public async connect(): Promise<void> {
    this.connection = this.protocol.connect({
      json: true,
      url: "nats://localhost:4222",
    });
  }

  public async disconnect(): Promise<void> {
    this.connection.close();
  }

  public async request(method: string, args: any[]): Promise<any> {
    return new Promise((res) =>
      this.connection.requestOne(method, args, 5000, res)
    );
  }

  public respond(method: string, cb: (...args: any[]) => Promise<any>): void {
    this.connection.subscribe(method, async (args: any[], replyTo: string) => {
      const response = await cb(...args);
      this.connection.publish(replyTo, response);
    });
  }

  public async publish(action: Action): Promise<void> {
    const { type, ...data } = action;
    return new Promise((res) =>
      this.connection.publish(action.type, data, res)
    );
  }

  public subscribe(type: string): Observable<Action> {
    return new Observable((subscriber) => {
      this.connection.subscribe(type, (data: any) =>
        subscriber.next({
          ...data,
          type,
        })
      );
    });
  }
}
