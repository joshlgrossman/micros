import { InjectionToken } from "../di";
import { ProtocolAdapter } from "./ProtocolAdapter";

export const PROTOCOL_ADAPTER: InjectionToken<ProtocolAdapter> = Symbol(
  "PROTOCOL_ADAPTER"
);
