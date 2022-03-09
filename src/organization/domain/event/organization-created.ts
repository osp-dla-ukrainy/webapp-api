import { Type } from 'class-transformer';
import { DomainEvent } from '../../../shared/events/domain-event';
import { OrganizationCurrentState } from '../entity/organization-current-state';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { ParticipantId } from '../value-object/participant-id';

export class OrganizationCreated extends DomainEvent<OrganizationCurrentState> {
  @Type(() => OrganizationId)
  readonly organizationId: OrganizationId;
  readonly type: OrganizationType;
  @Type(() => ParticipantId)
  readonly ownerId: ParticipantId;

  constructor(partial: Partial<OrganizationCreated>) {
    super();
    Object.assign(this, partial);
  }

  apply(state: OrganizationCurrentState): void {
    state.type = this.type;
  }
}
