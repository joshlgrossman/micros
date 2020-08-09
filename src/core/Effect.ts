import { Observable } from "rxjs";
import { Action } from "./Action";
import { EFFECT_METADATA_KEY } from "../internal";

export function Effect(): <
  P extends string,
  C extends { [key in P]: Observable<Action | void> }
>(
  target: C,
  property: P
) => void {
  return (target, property) => {
    const existingEffects: string[] =
      Reflect.getOwnMetadata(EFFECT_METADATA_KEY, target) ?? [];

    Reflect.defineMetadata(
      EFFECT_METADATA_KEY,
      [...existingEffects, property],
      target
    );
  };
}
