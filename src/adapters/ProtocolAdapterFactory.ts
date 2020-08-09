import {
  Injectable,
  Inject,
  DEPENDENCY_CONTAINER,
  DependencyContainer,
} from "../di";
import { ProtocolAdapter } from "./ProtocolAdapter";
import { Protocol } from "./Protocol";
import { NatsProtocolAdapter } from "./NatsProtocolAdapter";

@Injectable()
export class ProtocolAdapterFactory {
  constructor(
    @Inject(DEPENDENCY_CONTAINER)
    private readonly container: DependencyContainer
  ) {}

  public create(type: Protocol): ProtocolAdapter {
    switch (type) {
      case Protocol.NATS:
        return this.container.resolve(NatsProtocolAdapter);
    }
  }
}
