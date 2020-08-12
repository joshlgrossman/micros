import 'reflect-metadata';
import serviceA from './serviceA/v1';
import serviceB from './serviceB/v3';
import gateway from './gateway/v1';

serviceA.start().catch(console.log);
serviceB.start().catch(console.log);
serviceB.start().catch(console.log);
serviceB.start().catch(console.log);
gateway.start().catch(console.log);
