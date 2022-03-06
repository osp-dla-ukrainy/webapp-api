import { Container as InversifyJSContainer } from 'inversify';
import { FacebookAuthService } from '../identity/application/facebook-auth.service';
import { UserRepository } from '../identity/domain/repository/user.repository';
import { FacebookApiService } from '../identity/domain/service/facebook-api.service';
import { TypeOrmUserRepository } from '../identity/infrastructure/repository/type-orm.user.repository';
import { AuthController } from '../identity/ui/auth.controller';
import { AppConfig } from '../shared/config/app-config';
import { AxiosHttpClient } from '../shared/http-client/axios.http-client';
import { HttpClient } from '../shared/http-client/http-client';
import { ConsoleLogLogger, Logger } from '../shared/logger';

export const container = new InversifyJSContainer({
  defaultScope: 'Singleton',
  autoBindInjectable: true,
});

container.bind(HttpClient).to(AxiosHttpClient).inSingletonScope();

container
  .bind(AppConfig)
  .toDynamicValue(() => AppConfig.load())
  .inSingletonScope();

container.bind(FacebookApiService).to(FacebookApiService).inSingletonScope();

container.bind(AuthController).to(AuthController).inSingletonScope();

container.bind(FacebookAuthService).to(FacebookAuthService).inSingletonScope();

container.bind(UserRepository).to(TypeOrmUserRepository).inSingletonScope();

container.bind(Logger).to(ConsoleLogLogger).inSingletonScope();

export default container;
