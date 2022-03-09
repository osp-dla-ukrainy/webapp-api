import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';
import { createConnections } from 'typeorm';
import { inspect } from 'util';
import container from '../../../container';
import { EventPubSubQueueInjectToken } from '../../../inject-tokens';
import connectionOptions from '../../../shared/database/database-config';
import { Logger } from '../../../shared/logger';
import { QueueInterface } from '../../../shared/queue/queue';
import { Organization } from '../../domain/entity/organization';
import { Participant } from '../../domain/entity/participant';
import { OrganizationEvents, ParticipantEvents } from '../../domain/event/event-types';
import { IdempotentConsumer } from '../../domain/presentation/idempotent-consumer';
import { UnitOfWorkPresentation } from '../../domain/presentation/unit-of-work.presentation';
import { EventStore } from '../../infrastructure/events/event.store';

export async function runPresentationConsumer() {
  await createConnections(connectionOptions);
  const queue: QueueInterface = container.get(EventPubSubQueueInjectToken);
  const logger = container.get(Logger);

  await queue.consume(async (msg, channel) => {
    const uow = UnitOfWorkPresentation.create();
    const rawEvent: { entity: string; type: string } = JSON.parse(msg.content.toString('utf-8'));
    const eventStore: EventStore<any> = plainToInstance(EventStore, rawEvent);

    await uow.transactionStart();

    try {
      uow.saveIdempotentConsumer(
        new IdempotentConsumer({
          eventId: eventStore.id,
          consumer: runPresentationConsumer.name,
        })
      );

      if (eventStore.entity === Participant.name) {
        const domainEventType = ParticipantEvents.get(eventStore.type);
        const domainEvent = plainToInstance(domainEventType, eventStore.data);

        await uow.participantRepository.handle(domainEvent);
      }

      if (eventStore.entity === Organization.name) {
        const domainEventType = OrganizationEvents.get(eventStore.type);
        const domainEvent = plainToInstance(domainEventType, eventStore.data);

        await uow.organizationRepository.handle(domainEvent);
      }

      await uow.persist();
      await uow.transactionCommit();

      channel.ack(msg);
    } catch (e) {
      logger.error(inspect(e));
      await uow.transactionRollback();
    }
  });
}
