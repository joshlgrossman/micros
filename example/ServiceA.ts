import * as op from 'rxjs/operators';
import { Service, Effect, MessageBroker, Started, Version } from '../src/core';
import { Inject } from '../src/di';
import * as actions from './actions';
import { ServiceB } from './ServiceB';
import { LOGGER } from './logger';

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
    @Inject(ServiceB) private readonly serviceB: ServiceB,
    @Inject(LOGGER) private readonly logger: Console
  ) {}

  public async started(): Promise<void> {
    this.logger.log('started');
    setTimeout(async () => {
      const result = await this.serviceB.test('hello', 'world');
      const result2 = await this.serviceB.test2(123);
      this.logger.log('result is ', result + result2);
    }, 1000);
  }
}
