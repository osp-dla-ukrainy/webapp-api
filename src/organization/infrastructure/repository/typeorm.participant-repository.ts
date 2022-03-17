import { ClassConstructor } from 'class-transformer';
import { injectable } from 'inversify';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { Participant } from '../../domain/entity/participant';
import { ParticipantRepository } from '../../domain/repository/participant.repository';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { OrganizationConnection } from '../database/organization-database.config';
import { EventStore } from '../events/event.store';

@injectable()
export class TypeormParticipantRepository extends ParticipantRepository {
  constructor(private readonly queryRunner?: QueryRunner) {
    super();
  }

  async save(entity: Participant): Promise<void> {
    await this.getRepository(Participant).save(entity);
    await this.getRepository(EventStore).insert(EventStore.createFromDomainEvent(entity.events));
  }

  async findOneByUserId({ userId }: { userId: string }): Promise<Participant | undefined> {
    return this.getRepository(Participant).findOne({ where: { userId } });
  }

  async findOne(id: ParticipantId): Promise<Participant | undefined> {
    return this.getRepository(Participant)
      .createQueryBuilder('p')
      .where(`${nameofWithAlias<Participant>((p) => p.id)} = :participantId`, { participantId: id.valueOf })
      .getOne();
  }

  private getRepository<TEntity = Participant>(entity: ClassConstructor<TEntity>): Repository<TEntity> {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(entity)
      : getRepository(entity, OrganizationConnection);
  }
}
