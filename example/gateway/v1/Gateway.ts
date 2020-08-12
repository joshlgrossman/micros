import { Service, Version, OnStart } from '../../../src/core';
import { IGateway } from './IGateway';
import * as http from 'http';
import { Inject } from '../../../src/di';
import { IServiceA } from '../../serviceA/v1/IServiceA';
import { IServiceB } from '../../serviceB/v3/IServiceB';
import { SERVICE_A, SERVICE_B } from './providers';

@Service()
@Version(1)
export class Gateway implements IGateway {
  constructor(
    @Inject(SERVICE_A) private readonly serviceA: IServiceA,
    @Inject(SERVICE_B) private readonly serviceB: IServiceB
  ) {}

  @OnStart()
  public async start(): Promise<void> {
    const server = http.createServer(async (req, res) => {
      switch (req.url?.toLowerCase()) {
        case '/b/test': {
          const result = await this.serviceB.test('a', 'b');
          res.write(JSON.stringify(result));
          res.end();
          break;
        }
        case '/b/test2': {
          const result = await this.serviceB.test2(55);
          res.write(JSON.stringify(result));
          res.end();
          break;
        }
      }
    });

    server.listen(3000);
  }
}
