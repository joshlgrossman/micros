import { InjectionToken, DependencyContainer } from "tsyringe";

export { DependencyContainer };
export const DEPENDENCY_CONTAINER: InjectionToken<DependencyContainer> = Symbol(
  "DEPENDENCY_CONTAINER"
);
