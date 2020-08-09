import * as op from "rxjs/operators";
import {
  Service,
  Effect,
  MessageBroker,
  Started,
  Method,
  Version,
} from "../src/core";
import { Inject } from "../src/di";
import * as actions from "./actions";

@Service()
@Version(3)
export class ServiceB implements Started {
  @Effect()
  public readonly numberChanged = this.broker
    .subscribe(actions.NUMBER_CHANGED)
    .pipe(
      op.map((action) => action.newValue),
      op.tap((value) => console.log(value)),
      op.delay(500),
      op.map(() => new actions.AddNumber(2))
    );

  constructor(
    @Inject(MessageBroker) private readonly broker: MessageBroker<actions.All>
  ) {}

  public async started(): Promise<void> {
    console.log("started b");
  }

  @Method()
  public async test(a: any, b: any): Promise<number> {
    console.log("test", a, b);
    this.broker.dispatch(new actions.AddNumber(5));
    return 10;
  }
}
