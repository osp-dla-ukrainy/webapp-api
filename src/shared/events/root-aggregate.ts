import { DomainEvent } from './domain-event';
import { EventPublisher } from './event-publisher';

export abstract class RootAggregate<TCurrentState> {
  abstract readonly currentState: TCurrentState;
  private readonly _events: Array<DomainEvent<TCurrentState>> = [];
  private readonly eventPublisher: EventPublisher;
  get events() {
    return this._events;
  }

  apply(event: DomainEvent<TCurrentState>) {
    event.apply(this.currentState);
    this._events.push(event);
  }

  async commit(): Promise<void> {
    await Promise.all(this._events.map((event) => this.eventPublisher.handle(event)));
  }
}
