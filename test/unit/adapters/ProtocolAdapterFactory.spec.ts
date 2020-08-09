import {
  ProtocolAdapterFactory,
  ProtocolAdapter,
  Protocol,
} from '../../../src/adapters';
import { DependencyContainer } from '../../../src/di';
import { NatsProtocolAdapter } from '../../../src/adapters/nats/NatsProtocolAdapter';

describe('ProtocolAdapterFactory', () => {
  let container: jest.Mocked<DependencyContainer>;
  let adapter: jest.Mocked<ProtocolAdapter>;
  let factory: ProtocolAdapterFactory;

  beforeEach(() => {
    adapter = {
      configure: jest.fn(() => adapter),
    } as any;

    container = {
      resolve: jest.fn(() => adapter),
    } as any;

    factory = new ProtocolAdapterFactory(container);
  });

  describe('create', () => {
    it('should create a NATS protocol adapter', () => {
      const createdAdapter = factory.create({
        type: Protocol.NATS,
        json: false,
      } as any);

      expect(container.resolve).toBeCalledWith(NatsProtocolAdapter);
      expect(adapter.configure).toBeCalledWith({
        type: Protocol.NATS,
        json: false,
      });
      expect(createdAdapter).toEqual(adapter);
    });
  });
});
