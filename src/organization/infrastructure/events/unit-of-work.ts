import { getConnection, QueryRunner } from 'typeorm';
import { DomainEvent } from '../../../shared/events/domain-event';
import { OrganizationConnection } from '../database/organization-database.config';
import { EventStoreRepository } from './event-store.repository';

export class UnitOfWork {
  static create(): UnitOfWork {
    const qr = getConnection(OrganizationConnection).createQueryRunner();

    return new UnitOfWork(qr, new EventStoreRepository(qr));
  }

  private readonly sentEventsToInsert: DomainEvent[] = [];

  constructor(private readonly queryRunner: QueryRunner, private readonly eventStoreRepository: EventStoreRepository) {}

  addEvent(entity: DomainEvent) {
    this.sentEventsToInsert.push(entity);
  }

  async startTransaction(): Promise<void> {
    await this.queryRunner.startTransaction();
  }

  async persist(): Promise<void> {
    await this.eventStoreRepository.add(this.sentEventsToInsert);
  }

  async commitTransaction(): Promise<void> {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  async rollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }
}
