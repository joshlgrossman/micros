import { Protocol } from '../Protocol';

export interface NatsProtocolConfig {
  type: Protocol.NATS;
  json: boolean;
  servers: string[];
  timeout: number;
  maxRetries: number;
}
