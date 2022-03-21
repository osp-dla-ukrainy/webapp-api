import { getConnection, QueryRunner } from 'typeorm';
import { Organization } from '../../domain/entity/organization.entity';
import { Participant } from '../../domain/entity/participant.entity';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { ParticipantRepository } from '../../domain/repository/participant.repository';
import { OrganizationConnection } from '../database/organization-database.config';
import { TypeormOrganizationRepository } from '../repository/typeorm.organization.repository';
import { TypeormParticipantRepository } from '../repository/typeorm.participant-repository';
import { EventStoreRepository } from './event-store.repository';

export class UnitOfWork {
  static create(): UnitOfWork {
    const qr = getConnection(OrganizationConnection).createQueryRunner();

    return new UnitOfWork(
      qr,
      new TypeormOrganizationRepository(qr),
      new TypeormParticipantRepository(qr),
      new EventStoreRepository(qr)
    );
  }

  private organizations: Organization[] = [];
  private participants: Participant[] = [];

  constructor(
    private readonly queryRunner: QueryRunner,
    readonly organizationRepository: OrganizationRepository,
    readonly participantRepository: ParticipantRepository,
    readonly eventStoreRepository: EventStoreRepository
  ) {}

  saveOrganization(entity: Organization) {
    this.organizations.push(entity);
  }

  saveParticipant(entity: Participant) {
    this.participants.push(entity);
  }

  async startTransaction(): Promise<void> {
    await this.queryRunner.startTransaction();
  }

  async persist(): Promise<void> {
    await Promise.all(this.organizations.map((organization) => this.organizationRepository.save(organization)));
    await Promise.all(this.participants.map((organization) => this.participantRepository.save(organization)));
    const organizationEvents = this.organizations.flatMap((org) => org.events);
    const participantEvents = this.participants.flatMap((org) => org.events);

    await this.eventStoreRepository.add([...participantEvents, ...organizationEvents]);

    this.organizations = [];
    this.participants = [];
  }

  async commitTransaction(): Promise<void> {
    try {
      await this.queryRunner.commitTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }

  async rollbackTransaction(): Promise<void> {
    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }
}
