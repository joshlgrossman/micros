import * as op from 'rxjs/operators';
import {
  Service,
  Effect,
  MessageBroker,
  Started,
  Method,
  Version,
} from '../src/core';
import { Inject } from '../src/di';
import * as actions from './actions';
import { LOGGER } from './logger';

@Service()
@Version(3)
export class ServiceB implements Started {
  @Effect()
  public readonly numberChanged = this.broker
    .subscribe(actions.NUMBER_CHANGED)
    .pipe(
      op.map((action) => action.newValue),
      op.map((value) => console.log(value))
    );

  constructor(
    @Inject(MessageBroker) private readonly broker: MessageBroker<actions.All>,
    @Inject(LOGGER) private readonly logger: Console
  ) {}

  public async started(): Promise<void> {
    this.logger.log('started b');
  }

  @Method()
  public async test(a: string, b: string): Promise<number> {
    this.logger.log('test', a, b);
    this.broker.dispatch(new actions.AddNumber(7));
    return 10;
  }

  @Method()
  public async test2(num: number): Promise<number> {
    return num * 2;
  }
}
