import {
  Injectable,
  Inject,
  DEPENDENCY_CONTAINER,
  DependencyContainer,
} from '../di';
import { ProtocolAdapter } from './ProtocolAdapter';
import { Protocol } from './Protocol';
import { NatsProtocolAdapter } from './nats/NatsProtocolAdapter';
import { ProtocolAdapterConfig } from './ProtocolAdapterConfig';

@Injectable()
export class ProtocolAdapterFactory {
  constructor(
    @Inject(DEPENDENCY_CONTAINER)
    private readonly container: DependencyContainer
  ) {}

  public create(config: ProtocolAdapterConfig): ProtocolAdapter {
    switch (config.type) {
      case Protocol.NATS:
        return this.container.resolve(NatsProtocolAdapter).configure(config);
    }
  }
}
