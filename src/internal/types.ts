import { Action } from '../core';

export type Constructor<T> = {
  new (...args: any[]): T;
};

export type InternalClassDecorator<T> = (
  target: Constructor<T>
) => Constructor<T> | void;

export type ActionTypes<A extends Action> = A['type'];

export type ServiceFacade = {
  [key: string]: (...args: any[]) => Promise<any>;
};
