import { DomainEvent } from './domain-event';

export interface EventHandler<TEvent extends DomainEvent<any>> {
  handle(event: TEvent): Promise<void> | void;
}
