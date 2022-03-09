import { inject, injectable } from 'inversify';
import { EventPublishedQueueInjectToken } from '../../../inject-tokens';
import { EventHandler } from '../../../shared/events/event-handler';
import { GlobalEventHandler } from '../../../shared/events/handle-event.decorator';
import { QueueInterface } from '../../../shared/queue/queue';

@GlobalEventHandler()
@injectable()
export class PublishEventToQueueHandler implements EventHandler<any> {
  constructor(
    @inject(EventPublishedQueueInjectToken)
    private readonly eventQueue: QueueInterface
  ) {}

  async handle(event: any): Promise<void> {
    await this.eventQueue.produce(event);
  }
}
