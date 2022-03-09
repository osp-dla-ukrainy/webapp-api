import { Container as InversifyJSContainer } from 'inversify';
import { FacebookAuthService } from './identity/application/facebook-auth.service';
import { UserRepository } from './identity/domain/repository/user.repository';
import { FacebookApiService } from './identity/domain/service/facebook-api.service';
import { InternalOrganizationService, OrganizationService } from './identity/domain/service/organization.service';
import { TypeOrmUserRepository } from './identity/infrastructure/repository/type-orm.user.repository';
import { AuthController } from './identity/ui/auth.controller';
import { EventPublishedQueueInjectToken, EventPubSubQueueInjectToken } from './inject-tokens';
import { CreateOrganizationCommandHandler } from './organization/application/command/create-organization.command-handler';
import { CreateParticipantCommandHandler } from './organization/application/command/create-participant.command-handler';
import { PublishEventToQueueHandler } from './organization/domain/event-handler/publish-event-to-queue.handler';
import { OrganizationRepository } from './organization/domain/repository/organization.repository';
import { ParticipantRepository } from './organization/domain/repository/participant-repository';
import { SentEventRepository } from './organization/infrastructure/events/sent-event.repository';
import { TypeormOrganizationRepository } from './organization/infrastructure/repository/typeorm.organization.repository';
import { TypeormParticipantRepository } from './organization/infrastructure/repository/typeorm.participant-repository';
import { TypeormSentEventRepository } from './organization/infrastructure/repository/typeorm.sent-event.repository';
import { Config } from './shared/config/config';
import { EventHandler } from './shared/events/event-handler';
import { EventPublisher } from './shared/events/event-publisher';
import {
  EventHandlersMetadataStorage,
  GlobalEventHandlersMetadataStorage,
} from './shared/events/handle-event.decorator';
import { AxiosHttpClient } from './shared/http-client/axios.http-client';
import { HttpClient } from './shared/http-client/http-client';
import { ConsoleLogLogger, Logger } from './shared/logger';
import { PubSubQueue } from './shared/queue/pub-sub-queue';
import { RegularQueue } from './shared/queue/regular-queue';

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

container.bind(EventPubSubQueueInjectToken).toDynamicValue(({ container: contextContainer }) => {
  const { rabbit } = contextContainer.get(Config);

  return new PubSubQueue(
    {
      password: rabbit.password,
      queueName: 'pub-sub-event',
      username: rabbit.username,
      host: rabbit.host,
    },
    contextContainer.get(Logger)
  );
});

container.bind(EventPublishedQueueInjectToken).toDynamicValue(({ container: contextContainer }) => {
  const { rabbit } = contextContainer.get(Config);

  return new RegularQueue(
    {
      password: rabbit.password,
      queueName: 'events',
      username: rabbit.username,
      host: rabbit.host,
    },
    contextContainer.get(Logger)
  );
});

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

container.bind(SentEventRepository).to(TypeormSentEventRepository).inSingletonScope();
container.bind(CreateParticipantCommandHandler).to(CreateParticipantCommandHandler).inSingletonScope();
container
  .bind(ParticipantRepository)
  .toDynamicValue(() => new TypeormParticipantRepository())
  .inSingletonScope();
container.bind(OrganizationService).to(InternalOrganizationService).inSingletonScope();
container.bind(PublishEventToQueueHandler).to(PublishEventToQueueHandler).inSingletonScope();

export default container;
