import { injectable } from 'inversify';
import { getRepository, QueryRunner } from 'typeorm';
import { DomainEvent } from '../../../shared/events/domain-event';
import { EventHandler } from '../../../shared/events/event-handler';
import { GlobalEventHandler } from '../../../shared/events/handle-event.decorator';
import { OrganizationConnection } from '../database/organization-database.config';
import { EventStore } from './event.store';

@injectable()
@GlobalEventHandler()
export class EventStoreRepository implements EventHandler<any> {
  private get repository() {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(EventStore)
      : getRepository(EventStore, OrganizationConnection);
  }

  constructor(private readonly queryRunner?: QueryRunner) {}

  async add(event: DomainEvent | DomainEvent[]): Promise<void> {
    const events = Array.isArray(event) ? event : [event];

    const mapEvents = events.map(
      (e) =>
        new EventStore({
          data: e,
          entity: e.entity,
          type: e.constructor.name,
        })
    );

    await this.repository.insert(mapEvents);
  }

  async handle(event: DomainEvent): Promise<void> {
    await this.add(event);
  }
}
