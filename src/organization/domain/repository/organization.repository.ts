import { injectable } from 'inversify';
import { Organization } from '../entity/organization';
import { OrganizationId } from '../value-object/organization-id';
import { ParticipantId } from '../value-object/participant-id';

@injectable()
export abstract class OrganizationRepository {
  abstract save(entity: Organization): Promise<void>;

  abstract fineOne(id: OrganizationId): Promise<Organization | undefined>;

  abstract findOneByOwner(id: ParticipantId): Promise<Organization | undefined>;
}
