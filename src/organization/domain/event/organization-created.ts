import { DomainEvent } from '../../../shared/events/domain-event';
import { Organization } from '../entity/organization.entity';
import { Contact } from '../value-object/contact.entity';
import { Location } from '../value-object/location.entity';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { ParticipantId } from '../value-object/participant-id';
import { Qualification } from '../value-object/qualifications.entity';

export class OrganizationCreated extends DomainEvent {
  readonly organizationId: OrganizationId;
  readonly type: OrganizationType;
  readonly ownerId: ParticipantId;
  readonly entity: string = Organization.name;
  readonly location: Location;
  readonly contact: Contact;
  readonly name: string;
  readonly qualifications: Qualification[];

  constructor(partial: Partial<OrganizationCreated>) {
    super();
    Object.assign(this, partial);
  }
}
