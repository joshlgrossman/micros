import { nats } from '../../../../src/protocols';
import { NatsProtocolAdapter } from '../../../../src/adapters/nats/NatsProtocolAdapter';
import { Protocol } from '../../../../src/adapters';
import { tap } from 'rxjs/operators';

describe('NatsProtocolAdapter', () => {
  let protocol: jest.Mocked<typeof nats>;
  let client: jest.Mocked<nats.Client>;
  let adapter: NatsProtocolAdapter;

  beforeEach(() => {
    client = {
      close: jest.fn(),
      requestOne: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      publish: jest.fn(),
    } as any;

    protocol = {
      connect: jest.fn(() => client),
    } as any;

    adapter = new NatsProtocolAdapter(protocol).configure({
      type: Protocol.NATS,
      json: true,
      timeout: 1337,
      maxRetries: 3,
      servers: ['hello.world'],
    });
  });

  describe('connect', () => {
    it('should create a client', async () => {
      await adapter.connect();
      expect(protocol.connect).toBeCalled();
    });

    it('should create a client with the correct config', async () => {
      await adapter.connect();
      expect(protocol.connect).toBeCalledWith(
        expect.objectContaining({
          json: true,
          timeout: 1337,
          servers: ['hello.world'],
        })
      );
    });
  });

  describe('disconnect', () => {
    beforeEach(async () => {
      await adapter.connect();
    });

    it('should disconnect from the client', async () => {
      await adapter.disconnect();
      expect(client.close).toBeCalled();
    });
  });

  describe('request', () => {
    beforeEach(async () => {
      client.requestOne.mockImplementation((method, args, timeout, cb) =>
        (cb as any)([null, 'some response'])
      );

      await adapter.connect();
    });

    it('should create a request with the args', async () => {
      await adapter.request('someMethod', ['hello', 'world']);
      expect(client.requestOne).toBeCalledWith(
        'someMethod',
        ['hello', 'world'],
        1337,
        expect.any(Function)
      );
    });

    it('should resolve to the response', async () => {
      expect(await adapter.request('someMethod', ['hello', 'world'])).toEqual(
        'some response'
      );
    });

    describe('when the request times out', () => {
      beforeEach(async () => {
        client.requestOne.mockImplementation((method, args, timeout, cb) =>
          (cb as any)(new nats.NatsError('failed', nats.REQ_TIMEOUT))
        );

        await adapter.connect();
      });

      it('should retry the configured number of times', async () => {
        await expect(adapter.request('someMethod', ['test'])).rejects.toThrow();

        expect(client.requestOne).toBeCalledTimes(4);
      });
    });

    describe('when the request fails', () => {
      beforeEach(async () => {
        client.requestOne.mockImplementation((method, args, timeout, cb) =>
          (cb as any)([new Error('failed')])
        );

        await adapter.connect();
      });

      it('should throw the error', async () => {
        await expect(adapter.request('someMethod', ['test'])).rejects.toThrow(
          new Error('failed')
        );
      });
    });
  });

  describe('reply', () => {
    let callback: (...args: any[]) => Promise<any>;
    let subscriptionCallback: (...args: any[]) => Promise<any>;

    beforeEach(async () => {
      callback = jest.fn(() => Promise.resolve('hello'));
      client.subscribe.mockImplementation(
        (method, options, cb) => (subscriptionCallback = cb as any)
      );

      await adapter.connect();
    });

    it('should subscribe to the method', () => {
      adapter.reply('someMethod', callback);
      expect(client.subscribe).toBeCalledWith(
        'someMethod',
        { queue: 'someMethod' },
        expect.any(Function)
      );
    });

    it('should call the callback when message published', async () => {
      adapter.reply('someMethod', callback);
      await subscriptionCallback(['what', 'up'], 'some-unique-subject');

      expect(callback).toBeCalledWith('what', 'up');
    });

    it('should publish the response to the reply subject', async () => {
      adapter.reply('someMethod', callback);
      await subscriptionCallback([], 'some-unique-subject');

      expect(client.publish).toBeCalledWith('some-unique-subject', [
        undefined,
        'hello',
      ]);
    });

    it('should publish a serialized error', async () => {
      callback = jest.fn(() => Promise.reject(new Error('failed')));
      adapter.reply('someMethod', callback);
      await subscriptionCallback([], 'some-unique-subject');

      expect(client.publish).toBeCalledWith('some-unique-subject', [
        { message: 'failed', name: 'Error' },
      ]);
    });
  });

  describe('publish', () => {
    beforeEach(async () => {
      client.publish.mockImplementation((type, data, cb) => (cb as any)());

      await adapter.connect();
    });

    it('should publish the message', async () => {
      await adapter.publish({ type: 'SOME_EVENT', hello: 'world' });
      expect(client.publish).toBeCalledWith(
        'SOME_EVENT',
        { hello: 'world' },
        expect.any(Function)
      );
    });
  });

  describe('subscribe', () => {
    let subscriptionCallback: (...args: any[]) => Promise<any>;

    beforeEach(async () => {
      client.subscribe.mockImplementation((method, cb) => {
        subscriptionCallback = cb as any;
        return 1337;
      });

      await adapter.connect();
    });

    it('should subscribe to the message when the observable is subscribed to', () => {
      const observable = adapter.subscribe('SOME_EVENT');

      expect(client.subscribe).not.toBeCalled();
      observable.subscribe();
      expect(client.subscribe).toBeCalledWith(
        'SOME_EVENT',
        expect.any(Function)
      );
    });

    it('should emit whenever the subscription is published', () => {
      const observable = adapter.subscribe('SOME_EVENT');
      const spy = jest.fn();

      observable.pipe(tap((value) => spy(value))).subscribe();
      subscriptionCallback({ payload: 'hello' });
      subscriptionCallback({ payload: 'world' });
      subscriptionCallback({ payload: '!' });

      expect(spy).toBeCalledTimes(3);
      expect(spy).toBeCalledWith({ type: 'SOME_EVENT', payload: 'hello' });
      expect(spy).toBeCalledWith({ type: 'SOME_EVENT', payload: 'world' });
      expect(spy).toBeCalledWith({ type: 'SOME_EVENT', payload: '!' });
    });

    it('should unsubscribe from the subject when the observable is unsubscribed', () => {
      const observable = adapter.subscribe('SOME_EVENT');
      const spy = jest.fn();

      const subscription = observable
        .pipe(tap((value) => spy(value)))
        .subscribe();
      subscriptionCallback({ payload: 'hello' });

      subscription.unsubscribe();

      expect(client.unsubscribe).toBeCalledWith(1337);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ type: 'SOME_EVENT', payload: 'hello' });
    });
  });
});
