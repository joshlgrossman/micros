import * as op from 'rxjs/operators';
import {
  Service,
  Effect,
  MessageBroker,
  Version,
  OnStart,
} from '../../../src/core';
import { Inject } from '../../../src/di';
import * as actions from '../../actions';
import { LOGGER } from '../../logger';
import { IServiceA } from './IServiceA';
import { IServiceB } from '../../serviceB/v3/IServiceB';
import { SERVICE_B } from './providers';

@Service()
@Version(1)
export class ServiceA implements IServiceA {
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
    @Inject(SERVICE_B) private readonly serviceB: IServiceB,
    @Inject(LOGGER) private readonly logger: Console
  ) {}

  @OnStart()
  public async started(): Promise<void> {
    this.logger.log('started');
    setTimeout(async () => {
      // const result = await this.serviceB.test('hello', 'world');
      const result = await this.serviceB.test2(2);
      try {
        const result2 = await this.serviceB.test2(5);

        this.logger.log('result is ', result + result2);
      } catch (err) {
        this.logger.log('got err', err);
      }
    }, 1000);
  }
}
