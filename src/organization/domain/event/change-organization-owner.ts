import { DomainEvent } from '../../../shared/events/domain-event';
import { Organization } from '../entity/organization';
import { Participant } from '../entity/participant';
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
