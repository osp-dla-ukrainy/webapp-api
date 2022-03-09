import { getConnection, QueryRunner } from 'typeorm';
import { OrganizationReadableConnection } from '../../infrastructure/database/organization-database.config';
import { TypeormOrganizationRepository } from '../../infrastructure/repository/typeorm.organization.repository';
import { TypeormParticipantRepository } from '../../infrastructure/repository/typeorm.participant-repository';
import { OrganizationRepository } from '../repository/organization.repository';
import { ParticipantRepository } from '../repository/participant-repository';
import { IdempotentConsumer } from './idempotent-consumer';

export class UnitOfWorkPresentation {
  static create(): UnitOfWorkPresentation {
    const qr = getConnection(OrganizationReadableConnection).createQueryRunner();

    return new UnitOfWorkPresentation(qr, new TypeormOrganizationRepository(qr), new TypeormParticipantRepository(qr));
  }

  constructor(
    private readonly queryRunner: QueryRunner,
    readonly organizationRepository: OrganizationRepository,
    readonly participantRepository: ParticipantRepository
  ) {}

  private readonly idempotentConsumers: IdempotentConsumer[] = [];

  saveIdempotentConsumer(idempotentConsumer: IdempotentConsumer): void {
    this.idempotentConsumers.push(idempotentConsumer);
  }

  async transactionStart() {
    await this.queryRunner.startTransaction();
  }

  async persist() {
    await this.queryRunner.manager.getRepository(IdempotentConsumer).save(this.idempotentConsumers);
  }

  async transactionCommit() {
    try {
      await this.queryRunner.commitTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }

  async transactionRollback() {
    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }
}
