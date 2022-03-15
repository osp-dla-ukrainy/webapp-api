import { DomainEvent } from '../../../shared/events/domain-event';
import { Organization } from '../entity/organization';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { ParticipantId } from '../value-object/participant-id';

export class OrganizationCreated extends DomainEvent {
  readonly organizationId: OrganizationId;
  readonly type: OrganizationType;
  readonly ownerId: ParticipantId;
  readonly entity: string = Organization.name;

  constructor(partial: Partial<OrganizationCreated>) {
    super();
    Object.assign(this, partial);
  }
}