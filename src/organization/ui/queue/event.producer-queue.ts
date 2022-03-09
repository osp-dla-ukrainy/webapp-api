import 'reflect-metadata';
import { Message } from 'amqplib/properties';
import { createConnections } from 'typeorm';
import container from '../../../container';
import { EventPublishedQueueInjectToken, EventPubSubQueueInjectToken } from '../../../inject-tokens';
import connectionOptions from '../../../shared/database/database-config';
import { Logger } from '../../../shared/logger';
import { QueueInterface } from '../../../shared/queue/queue';
import { SentEvent } from '../../domain/event/sent-event';
import { SentEventRepository } from '../../infrastructure/events/sent-event.repository';
import { UnitOfWork } from '../../infrastructure/events/unit-of-work';
import { EventStoreRepository } from '../../infrastructure/events/event-store.repository';

export async function runEventProducer() {
  await createConnections(connectionOptions);
  const pubSubQueue: QueueInterface = container.get(EventPubSubQueueInjectToken);
  const publishedEvent: QueueInterface = container.get(EventPublishedQueueInjectToken);
  const sendEventRepository = container.get(SentEventRepository);
  const eventStoreRepository = container.get(EventStoreRepository);
  const logger = container.get(Logger);

  logger.log(`Started event producer`);

  await publishedEvent.consume(async (msg: Message, channel) => {
    const newestEvent = await sendEventRepository.findNewest();

    const eventsToPropagate = await eventStoreRepository.findGreaterThanVersion({
      version: newestEvent?.eventStore.version ?? 0,
    });

    eventsToPropagate.length && logger.log(`Took ${eventsToPropagate.length} to propagate`);

    for (const event of eventsToPropagate) {
      const uow = UnitOfWork.create();
      const sendEvent = new SentEvent({ eventStore: event });

      try {
        await uow.startTransaction();
        sendEvent.success();
        uow.saveSentEvent(sendEvent);

        await uow.persist();
        await pubSubQueue.produce(event);
        await uow.commitTransaction();
      } catch (e) {
        logger.log(e);
        await uow.rollbackTransaction();
        sendEvent.failed();
        await sendEventRepository.save(sendEvent);
      }
    }
    channel.ack(msg);
  });
}
