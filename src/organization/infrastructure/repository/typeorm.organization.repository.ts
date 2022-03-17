import { ClassConstructor } from 'class-transformer';
import { injectable } from 'inversify';
import { getRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { Organization } from '../../domain/entity/organization.entity';
import { Participant } from '../../domain/entity/participant.entity';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { Contact } from '../../domain/value-object/contact.entity';
import { Location } from '../../domain/value-object/location.entity';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { Qualification } from '../../domain/value-object/qualifications.entity';
import { OrganizationConnection } from '../database/organization-database.config';
import { PaginationOptions } from './pagination-options';

@injectable()
export class TypeormOrganizationRepository extends OrganizationRepository {
  constructor(private readonly queryRunner?: QueryRunner) {
    super();
  }

  async findOneByOwner(id: ParticipantId): Promise<Organization | undefined> {
    return this.createQueryBuilder()
      .where(`${nameofWithAlias<Participant>((oo) => oo.id)} = :participantId`, { participantId: id.valueOf })
      .getOne();
  }

  async fineOne(id: OrganizationId): Promise<Organization | undefined> {
    return this.getRepository(Organization).findOne({ where: { id: id.valueOf } });
  }

  async findOneByName(name: string): Promise<Organization | undefined> {
    return this.createQueryBuilder()
      .where(`${nameofWithAlias<Organization>((o) => o.name)} ilike :name`, { name })
      .getOne();
  }

  async findByQuery({
    name,
    paginationOptions,
  }: {
    name?: string;
    paginationOptions: PaginationOptions;
  }): Promise<Organization[]> {
    const qb = this.createQueryBuilder();

    if (name) {
      qb.where(`${nameofWithAlias<Organization>((o) => o.name)} ilike :name`, { name });
    }

    return qb.offset(paginationOptions.offset).limit(paginationOptions.limit).getMany();
  }

  async save(entity: Organization) {
    await this.getRepository(Location).save(entity.location);
    await this.getRepository(Contact).save(entity.contact);

    const originalOwnerId = entity.owner.id;
    const originalOrganizationId = entity.id;

    Object.assign(entity.owner, { id: originalOwnerId.valueOf });
    await this.getRepository(Organization).save(entity);

    Object.assign(entity, { id: originalOrganizationId.valueOf });

    await this.getRepository(Qualification).save(
      entity.qualifications.map((q) => ({
        ...q,
        organization: entity,
      }))
    );

    Object.assign(entity.owner, { id: originalOwnerId });
    Object.assign(entity, { id: originalOrganizationId });
  }

  private createQueryBuilder(): SelectQueryBuilder<Organization> {
    return this.getRepository(Organization)
      .createQueryBuilder('o')
      .innerJoinAndSelect(
        nameofWithAlias<Organization>((o) => o.owner),
        'oo'
      )
      .innerJoinAndSelect(
        nameofWithAlias<Organization>((o) => o.contact),
        'oc'
      )
      .innerJoinAndSelect(
        nameofWithAlias<Organization>((o) => o.location),
        'ol'
      )
      .leftJoinAndSelect(
        nameofWithAlias<Organization>((o) => o.qualifications),
        'oq'
      );
  }

  private getRepository<TEntity = Organization>(entity: ClassConstructor<TEntity>): Repository<TEntity> {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(entity)
      : getRepository(entity, OrganizationConnection);
  }
}
