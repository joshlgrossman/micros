export const NUMBER_CHANGED = "NUMBER_CHANGED";

export class NumberChanged {
  readonly type = NUMBER_CHANGED;
  constructor(readonly newValue: number) {}
}
