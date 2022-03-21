import { DomainEvent } from '../../../shared/events/domain-event';
import { Organization } from '../entity/organization.entity';
import { Participant } from '../entity/participant.entity';
import { OrganizationId } from '../value-object/organization-id';

export class ChangeOrganizationOwner extends DomainEvent {
  readonly organizationId: OrganizationId;
  readonly owner: Participant;
  readonly entity: string = Organization.name;

  constructor(partial: Partial<ChangeOrganizationOwner>) {
    super();
    Object.assign(this, partial);
  }
}
