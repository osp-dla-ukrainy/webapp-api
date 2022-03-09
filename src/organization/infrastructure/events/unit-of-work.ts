import { getConnection, getRepository, QueryRunner } from 'typeorm';
import { OrganizationWritableConnection } from '../database/organization-database.config';
import { SentEvent } from '../../domain/event/sent-event';

export class UnitOfWork {
  static create(): UnitOfWork {
    return new UnitOfWork(getConnection(OrganizationWritableConnection).createQueryRunner());
  }

  private readonly sentEventsToInsert: SentEvent[] = [];
  constructor(private readonly queryRunner: QueryRunner) {}

  saveSentEvent(entity: SentEvent) {
    this.sentEventsToInsert.push(entity);
  }

  async startTransaction(): Promise<void> {
    await this.queryRunner.startTransaction();
  }

  async persist(): Promise<void> {
    await getRepository(SentEvent, OrganizationWritableConnection).save(this.sentEventsToInsert);
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
