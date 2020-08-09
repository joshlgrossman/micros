import { MessageBroker } from '../../../src/core';
import { ProtocolAdapter } from '../../../src/adapters';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

describe('MessageBroker', () => {
  let adapter: jest.Mocked<ProtocolAdapter>;
  let broker: MessageBroker<any>;

  beforeEach(() => {
    adapter = {
      publish: jest.fn(),
      subscribe: jest.fn(() => of()),
    } as any;

    broker = new MessageBroker(adapter);
  });

  describe('publish', () => {
    it('should publish an action', () => {
      broker.dispatch({ type: 'SOME_EVENT', data: 123 });
      expect(adapter.publish).toBeCalledWith({ type: 'SOME_EVENT', data: 123 });
    });
  });

  describe('subscribe', () => {
    it('should subscribe to all events', () => {
      broker.subscribe('EVENT1', 'EVENT2');
      expect(adapter.subscribe).toBeCalledTimes(2);
      expect(adapter.subscribe).toBeCalledWith('EVENT1');
      expect(adapter.subscribe).toBeCalledWith('EVENT2');
    });

    it('should merge subscriptions into single stream', () => {
      const spy = jest.fn();

      adapter.subscribe
        .mockReturnValueOnce(of({ type: 'A' }))
        .mockReturnValueOnce(of({ type: 'B' }));

      broker
        .subscribe('A', 'B')
        .pipe(tap((value) => spy(value)))
        .subscribe();

      expect(spy).toBeCalledTimes(2);
      expect(spy).toBeCalledWith({ type: 'A' });
      expect(spy).toBeCalledWith({ type: 'B' });
    });
  });
});
