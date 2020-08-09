export interface ServiceB {
  test(a: string, b: string): Promise<number>;
  test2(num: number): Promise<number>;
}
