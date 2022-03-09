import { captureException } from '@sentry/node';
import { injectable } from 'inversify';
import { inspect } from 'util';
import { Logger } from '../logger';
import { DomainEvent } from './domain-event';
import { EventHandler } from './event-handler';

@injectable()
export class EventPublisher {
  constructor(
    private readonly eventHandlers: Map<string, EventHandler<any>[]>,
    private readonly logger: Logger,
    private readonly globalEventHandlers: EventHandler<any>[]
  ) {}

  mergeContext(entity: any): void {
    if (entity) {
      Object.assign(entity, { eventPublisher: this });
    }
  }

  async handle(event: DomainEvent<any>) {
    const handlers = this.eventHandlers.get(event.constructor.name) ?? [];
    const allHandlers = [...handlers, ...this.globalEventHandlers];

    await Promise.all(
      allHandlers.map(async (handler) => {
        try {
          await handler.handle(event);
        } catch (e) {
          this.logger.error(inspect(e));
          captureException(e);
        }
      })
    );
  }
}
