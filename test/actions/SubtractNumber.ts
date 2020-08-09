export const SUBTRACT_NUMBER = "SUBTRACT_NUMBER";

export class SubtractNumber {
  readonly type = SUBTRACT_NUMBER;
  constructor(readonly value: number) {}
}
