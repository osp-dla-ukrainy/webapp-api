import { injectable } from 'inversify';
import { getRepository, MoreThan } from 'typeorm';
import { OrganizationWritableConnection } from '../database/organization-database.config';
import { EventStore } from './event.store';

@injectable()
export class EventStoreRepository {
  async findGreaterThanVersion({ version }: { version: number }): Promise<EventStore<any>[]> {
    return getRepository(EventStore, OrganizationWritableConnection).find({ version: MoreThan(version) });
  }
}
