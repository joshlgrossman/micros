import * as op from 'rxjs/operators';
import {
  Service,
  Effect,
  MessageBroker,
  Version,
  Started,
} from '../../src/core';
import { Inject } from '../../src/di';
import * as actions from '../actions';
import { LOGGER } from '../logger';
import { ServiceA } from './ServiceA';
import { ServiceBImpl } from '../serviceB/ServiceBImpl';
import { ServiceB } from '../serviceB/ServiceB';

@Service()
@Version(1)
export class ServiceAImpl implements ServiceA, Started {
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
    @Inject(ServiceBImpl) private readonly serviceB: ServiceB,
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
