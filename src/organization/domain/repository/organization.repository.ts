import { injectable } from 'inversify';
import { PaginationOptions } from '../../infrastructure/repository/pagination-options';
import { Organization } from '../entity/organization.entity';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { ParticipantId } from '../value-object/participant-id';

@injectable()
export abstract class OrganizationRepository {
  abstract save(entity: Organization): Promise<void>;

  abstract fineOne(id: OrganizationId): Promise<Organization | undefined>;

  abstract findOneByOwner(id: ParticipantId): Promise<Organization | undefined>;

  abstract findOneByName(name: string): Promise<Organization | undefined>;

  abstract findByQuery({
    name,
    paginationOptions,
    organizationTypes,
  }: {
    name?: string;
    paginationOptions: PaginationOptions;
    organizationTypes: OrganizationType[];
  }): Promise<Organization[]>;
}
