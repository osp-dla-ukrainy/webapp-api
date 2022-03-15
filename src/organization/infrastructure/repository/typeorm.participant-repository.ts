import { injectable } from 'inversify';
import { getRepository, QueryRunner } from 'typeorm';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { Participant } from '../../domain/entity/participant';
import { ParticipantRepository } from '../../domain/repository/participant.repository';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { OrganizationConnection } from '../database/organization-database.config';

@injectable()
export class TypeormParticipantRepository extends ParticipantRepository {
  private get repository() {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(Participant)
      : getRepository(Participant, OrganizationConnection);
  }

  constructor(private readonly queryRunner?: QueryRunner) {
    super();
  }

  async save(entity: Participant): Promise<void> {
    await this.repository.save(entity);
  }

  async findOneByUserId({ userId }: { userId: string }): Promise<Participant | undefined> {
    return this.repository.findOne({ where: { userId } });
  }

  async findOne(id: ParticipantId): Promise<Participant | undefined> {
    return this.repository
      .createQueryBuilder('p')
      .where(`${nameofWithAlias<Participant>((p) => p.id)} = :participantId`, { participantId: id.valueOf })
      .getOne();
  }
}
