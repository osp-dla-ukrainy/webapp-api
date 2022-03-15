import { BaseEntity } from 'typeorm';
import { DomainEvent } from './domain-event';
import { EventPublisher } from './event-publisher';

export abstract class RootAggregate extends BaseEntity {
  private readonly _events: Array<DomainEvent> = [];
  private readonly eventPublisher: EventPublisher;
  get events() {
    return this._events;
  }

  apply(event: DomainEvent) {
    this._events.push(event);
  }

  async commit(): Promise<void> {
    await Promise.all(this._events.map((event) => this.eventPublisher.handle(event)));
  }
}
