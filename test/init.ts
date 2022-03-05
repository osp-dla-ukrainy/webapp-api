import { config } from 'dotenv';
config({ path: './test/test.env' });
import { FacebookApiService } from '../src/identity/domain/service/facebook-api.service';
import { Container } from '../src/ioc/container';

export async function init() {
  const container = Container.getInstance();

  container.rebind(FacebookApiService).toConstantValue({
    createAccessToken: jest.fn(),
    getUserData: jest.fn,
  } as unknown as FacebookApiService);
}
