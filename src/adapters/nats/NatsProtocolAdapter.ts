import { Observable } from 'rxjs';
import { ProtocolAdapter } from '../ProtocolAdapter';
import { Inject, Singleton } from '../../di';
import { NATS_PROTOCOL, nats } from '../../protocols';
import { Action } from '../../core';
import { NatsProtocolConfig } from './NatsProtocolConfig';
import { serializeError } from '../../internal';

@Singleton()
export class NatsProtocolAdapter implements ProtocolAdapter {
  private connection!: nats.Client;
  private config!: NatsProtocolConfig;

  constructor(@Inject(NATS_PROTOCOL) private readonly protocol: typeof nats) {}

  public configure(config: NatsProtocolConfig): this {
    this.config = config;
    return this;
  }

  public async connect(): Promise<void> {
    this.connection = this.protocol.connect(this.config);
  }

  public async disconnect(): Promise<void> {
    this.connection.close();
  }

  public async request(method: string, args: any[]): Promise<any> {
    for (let i = this.config.maxRetries; i >= 0; i--) {
      try {
        return await new Promise((res, rej) => {
          this.connection.requestOne(
            method,
            args,
            this.config.timeout,
            (msg: any) => {
              if (msg instanceof nats.NatsError) {
                rej(msg);
                return;
              }

              const [err, result] = msg;

              if (err) {
                rej(err);
              } else {
                res(result);
              }
            }
          );
        });
      } catch (err) {
        if (
          i === 0 ||
          !(err instanceof nats.NatsError && err.code === nats.REQ_TIMEOUT)
        ) {
          throw err;
        }
      }
    }
  }

  public reply(method: string, cb: (...args: any[]) => Promise<any>): void {
    this.connection.subscribe(
      method,
      { queue: method },
      async (args: any[], replyTo: string) => {
        try {
          const response = await cb(...args);
          this.connection.publish(replyTo, [undefined, response]);
        } catch (err) {
          this.connection.publish(replyTo, [serializeError(err)]);
        }
      }
    );
  }

  public async publish<T extends Action>(action: T): Promise<void> {
    const { type, ...data } = action;
    return new Promise((res) => this.connection.publish(type, data, res));
  }

  public subscribe(type: string): Observable<Action> {
    return new Observable((subscriber) => {
      const subscription = this.connection.subscribe(type, (data: any) =>
        subscriber.next({
          ...data,
          type,
        })
      );

      return () => {
        this.connection.unsubscribe(subscription);
      };
    });
  }
}
