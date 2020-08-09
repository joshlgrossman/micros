export const ADD_NUMBER = 'ADD_NUMBER';

export class AddNumber {
  readonly type = ADD_NUMBER;
  constructor(readonly value: number) {}
}
