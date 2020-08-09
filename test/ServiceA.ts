import * as op from "rxjs/operators";
import { Service, Effect, MessageBroker, Started, Version } from "../src/core";
import { Inject } from "../src/di";
import * as actions from "./actions";
import { ServiceB } from "./ServiceB";

@Service()
@Version(1)
export class ServiceA implements Started {
  private number = 10;

  @Effect()
  public readonly addNumber = this.broker.subscribe(actions.ADD_NUMBER).pipe(
    op.map((action) => (this.number += action.value)),
    op.map((newValue) => new actions.NumberChanged(newValue))
  );

  @Effect()
  public readonly subtractNumber = this.broker
    .subscribe(actions.SUBTRACT_NUMBER)
    .pipe(
      op.map((action) => (this.number -= action.value)),
      op.map((newValue) => new actions.NumberChanged(newValue))
    );

  constructor(
    @Inject(MessageBroker) private readonly broker: MessageBroker<actions.All>,
    @Inject(ServiceB) private readonly serviceB: ServiceB
  ) {}

  public async started(): Promise<void> {
    console.log("started");
    setTimeout(async () => {
      const result = await this.serviceB.test("hello", "world");
      console.log("result is ", result);
    }, 1000);
  }
}
