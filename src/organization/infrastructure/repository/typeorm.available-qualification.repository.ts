import { ClassConstructor } from 'class-transformer';
import { injectable } from 'inversify';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { AvailableQualificationRepository } from '../../domain/repository/available-qualification.repository';
import { AvailableQualification } from '../../domain/value-object/available-qualification.entity';
import { OrganizationConnection } from '../database/organization-database.config';

@injectable()
export class TypeormAvailableQualificationRepository extends AvailableQualificationRepository {
  constructor(private readonly queryRunner?: QueryRunner) {
    super();
  }

  private getRepository<TEntity = AvailableQualification>(entity: ClassConstructor<TEntity>): Repository<TEntity> {
    return this.queryRunner
      ? this.queryRunner.manager.getRepository(entity)
      : getRepository(entity, OrganizationConnection);
  }

  findAll(): Promise<AvailableQualification[]> {
    return this.getRepository(AvailableQualification).find();
  }
}
