import { nats } from '../../../src/protocols';
import { NatsProtocolAdapter } from '../../../src/adapters';

describe('NatsProtocolAdapter', () => {
  let protocol: jest.Mocked<typeof nats>;
  let client: jest.Mocked<nats.Client>;
  let adapter: NatsProtocolAdapter;

  beforeEach(() => {
    client = {
      close: jest.fn(),
      requestOne: jest.fn(),
      subscribe: jest.fn(),
      publish: jest.fn(),
    } as any;

    protocol = {
      connect: jest.fn(() => client),
    } as any;

    adapter = new NatsProtocolAdapter(protocol);
  });

  it('should create a client', async () => {
    await adapter.connect();
    expect(protocol.connect).toBeCalled();
  });

  it('should disconnect from the client', async () => {
    await adapter.connect();
    await adapter.disconnect();
    expect(client.close).toBeCalled();
  });
});
