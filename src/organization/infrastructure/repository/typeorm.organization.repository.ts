import { injectable } from 'inversify';
import { getRepository, QueryRunner } from 'typeorm';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { Organization } from '../../domain/entity/organization';
import { Participant } from '../../domain/entity/participant';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { OrganizationConnection } from '../database/organization-database.config';

@injectable()
export class TypeormOrganizationRepository extends OrganizationRepository {
  private get repository() {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(Organization)
      : getRepository(Organization, OrganizationConnection);
  }

  constructor(private readonly queryRunner?: QueryRunner) {
    super();
  }

  async findOneByOwner(id: ParticipantId): Promise<Organization | undefined> {
    return this.repository
      .createQueryBuilder('o')
      .innerJoinAndSelect(
        nameofWithAlias<Organization>((o) => o.owner),
        'oo'
      )
      .where(`${nameofWithAlias<Participant>((oo) => oo.id)} = :participantId`, { participantId: id.valueOf })
      .getOne();
  }

  async save(entity: Organization) {
    Object.assign(entity.owner, { id: entity.owner.id.valueOf });
    await this.repository.save(entity);
  }

  async fineOne(id: OrganizationId): Promise<Organization | undefined> {
    return this.repository.findOne({ where: { id: id.valueOf } });
  }
}
