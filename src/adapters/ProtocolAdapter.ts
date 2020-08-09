import { Action } from '../core';
import { Observable } from 'rxjs';
import { ProtocolAdapterConfig } from './ProtocolAdapterConfig';

export interface ProtocolAdapter {
  configure(config: ProtocolAdapterConfig): this;
  connect(): Promise<any>;
  disconnect(): Promise<any>;
  request(method: string, args: any[]): Promise<any>;
  reply(method: string, cb: (...args: any[]) => Promise<any>): void;
  publish(action: Action): Promise<any>;
  subscribe(actionType: string): Observable<Action>;
}
