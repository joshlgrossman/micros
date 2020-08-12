export interface IServiceB {
  test(a: string, b: string): Promise<number>;
  test2(num: number): Promise<number>;
}
