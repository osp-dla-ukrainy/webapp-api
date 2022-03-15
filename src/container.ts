import { Container as InversifyJSContainer } from 'inversify';
import { FacebookAuthService } from './identity/application/facebook-auth.service';
import { UserRepository } from './identity/domain/repository/user.repository';
import { FacebookApiService } from './identity/domain/service/facebook-api.service';
import { InternalOrganizationService, OrganizationService } from './identity/domain/service/organization.service';
import { TypeOrmUserRepository } from './identity/infrastructure/repository/type-orm.user.repository';
import { AuthController } from './identity/ui/auth.controller';
import { CreateOrganizationCommandHandler } from './organization/application/command/create-organization.command-handler';
import { CreateParticipantCommandHandler } from './organization/application/command/create-participant.command-handler';
import { OrganizationRepository } from './organization/domain/repository/organization.repository';
import { ParticipantRepository } from './organization/domain/repository/participant.repository';
import { EventStoreRepository } from './organization/infrastructure/events/event-store.repository';
import { TypeormOrganizationRepository } from './organization/infrastructure/repository/typeorm.organization.repository';
import { TypeormParticipantRepository } from './organization/infrastructure/repository/typeorm.participant-repository';
import { Config } from './shared/config/config';
import { CommandBus } from './shared/events/command-bus';
import { CommandHandler } from './shared/events/command-handler';
import { CommandHandlerMetadataStorage } from './shared/events/command-handler.decorator';
import { EventHandler } from './shared/events/event-handler';
import { EventPublisher } from './shared/events/event-publisher';
import {
  EventHandlersMetadataStorage,
  GlobalEventHandlersMetadataStorage,
} from './shared/events/handle-event.decorator';
import { QueryBus } from './shared/events/query-bus';
import { QueryHandler } from './shared/events/query-handler';
import { QueryHandlerMetadataStorage } from './shared/events/query-handler.decorator';
import { AxiosHttpClient } from './shared/http-client/axios.http-client';
import { HttpClient } from './shared/http-client/http-client';
import { ConsoleLogLogger, Logger } from './shared/logger';

export const container = new InversifyJSContainer({
  defaultScope: 'Singleton',
  autoBindInjectable: true,
});

container.bind(HttpClient).to(AxiosHttpClient).inSingletonScope();

container
  .bind(Config)
  .toDynamicValue(() => Config.load())
  .inSingletonScope();

container.bind(FacebookApiService).to(FacebookApiService).inSingletonScope();

container.bind(AuthController).to(AuthController).inSingletonScope();

container.bind(FacebookAuthService).to(FacebookAuthService).inSingletonScope();

container.bind(UserRepository).to(TypeOrmUserRepository).inSingletonScope();

container.bind(Logger).to(ConsoleLogLogger).inSingletonScope();

container
  .bind(OrganizationRepository)
  .toDynamicValue(() => new TypeormOrganizationRepository())
  .inSingletonScope();

container.bind(CreateOrganizationCommandHandler).to(CreateOrganizationCommandHandler).inSingletonScope();

container.bind(EventPublisher).toDynamicValue(({ container: contextContainer }) => {
  const eventHandlers = new Map<string, EventHandler<any>[]>();

  for (const [event, handlersToken] of EventHandlersMetadataStorage.entries()) {
    eventHandlers.set(
      event,
      handlersToken.map((handlerToken) => contextContainer.get(handlerToken))
    );
  }

  const globalEventHandlers: EventHandler<any>[] = [];

  for (const handlerToken of GlobalEventHandlersMetadataStorage.values()) {
    globalEventHandlers.push(contextContainer.get(handlerToken));
  }

  return new EventPublisher(eventHandlers, contextContainer.get(Logger), globalEventHandlers);
});

container.bind(CreateParticipantCommandHandler).to(CreateParticipantCommandHandler).inSingletonScope();
container
  .bind(ParticipantRepository)
  .toDynamicValue(() => new TypeormParticipantRepository())
  .inSingletonScope();
container.bind(OrganizationService).to(InternalOrganizationService).inSingletonScope();

container
  .bind(EventStoreRepository)
  .toDynamicValue(() => new EventStoreRepository())
  .inSingletonScope();

container.bind(CommandBus).toDynamicValue(({ container: contextContainer }) => {
  const commandHandlers: Map<string, CommandHandler<any>> = new Map();

  for (const [command, handlerToken] of CommandHandlerMetadataStorage.entries()) {
    commandHandlers.set(command, contextContainer.get(handlerToken));
  }

  return new CommandBus(commandHandlers);
});

container.bind(QueryBus).toDynamicValue(({ container: contextContainer }) => {
  const queryHandlers: Map<string, QueryHandler<any, any>> = new Map();

  for (const [command, handlerToken] of QueryHandlerMetadataStorage.entries()) {
    queryHandlers.set(command, contextContainer.get(handlerToken));
  }

  return new QueryBus(queryHandlers);
});

export default container;
