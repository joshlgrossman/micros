import { Action } from "../core";

export type Constructor<T> = {
  new (...args: any[]): T;
};

export type InternalClassDecorator<T> = (
  target: Constructor<T>
) => Constructor<T> | void;

export type ActionTypes<A extends Action> = A["type"];

export type ActionOfType<A extends Action, T extends string> = {
  [key in A["type"]]: A;
};
