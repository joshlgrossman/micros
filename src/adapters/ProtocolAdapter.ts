import { Action } from "../core";
import { Observable } from "rxjs";

export interface ProtocolAdapter {
  connect(): Promise<any>;
  disconnect(): Promise<any>;
  request(method: string, args: any[]): Promise<any>;
  respond(method: string, cb: (...args: any[]) => Promise<any>): void;
  publish(action: Action): Promise<any>;
  subscribe(actionType: string): Observable<Action>;
}
