import { InjectionToken } from "../di";
import * as nats from "nats";

export { nats };
export const NATS_PROTOCOL: InjectionToken<Promise<typeof nats>> = Symbol(
  "NATS_PROTOCOL"
);
