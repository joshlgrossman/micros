import { InjectionToken } from '../di';
import { ServiceNode } from './ServiceNode';

export const SERVICE_NODE: InjectionToken<ServiceNode> = Symbol('SERVICE_NODE');
