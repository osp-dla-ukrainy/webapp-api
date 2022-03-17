import { ClassConstructor } from 'class-transformer';
import { injectable } from 'inversify';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { Organization } from '../../domain/entity/organization';
import { Participant } from '../../domain/entity/participant';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { Location } from '../../domain/value-object/location';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { OrganizationConnection } from '../database/organization-database.config';

@injectable()
export class TypeormOrganizationRepository extends OrganizationRepository {
  constructor(private readonly queryRunner?: QueryRunner) {
    super();
  }

  async findOneByOwner(id: ParticipantId): Promise<Organization | undefined> {
    return this.getRepository(Organization)
      .createQueryBuilder('o')
      .innerJoinAndSelect(
        nameofWithAlias<Organization>((o) => o.owner),
        'oo'
      )
      .where(`${nameofWithAlias<Participant>((oo) => oo.id)} = :participantId`, { participantId: id.valueOf })
      .getOne();
  }

  async save(entity: Organization) {
    await this.getRepository(Location).save(entity.location);
    Object.assign(entity.owner, { id: entity.owner.id.valueOf });
    await this.getRepository(Organization).save(entity);
  }

  async fineOne(id: OrganizationId): Promise<Organization | undefined> {
    return this.getRepository(Organization).findOne({ where: { id: id.valueOf } });
  }

  private getRepository<TEntity = Organization>(entity: ClassConstructor<TEntity>): Repository<TEntity> {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(entity)
      : getRepository(entity, OrganizationConnection);
  }
}
