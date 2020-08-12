import * as op from 'rxjs/operators';
import {
  Service,
  Effect,
  MessageBroker,
  Method,
  Version,
  OnStart,
} from '../../../src/core';
import { Inject } from '../../../src/di';
import * as actions from '../../actions';
import { LOGGER } from '../../logger';
import { IServiceB } from './IServiceB';

@Service()
@Version(3)
export class ServiceB implements IServiceB {
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

  @OnStart()
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
    this.logger.log('trying', num);

    if (num > 2) {
      throw new Error('failed');
    }

    return num * 2;
  }
}
