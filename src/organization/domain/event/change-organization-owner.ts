import { Type } from 'class-transformer';
import { DomainEvent } from '../../../shared/events/domain-event';
import { OrganizationCurrentState } from '../entity/organization-current-state';
import { Participant } from '../entity/participant';
import { OrganizationId } from '../value-object/organization-id';

export class ChangeOrganizationOwner extends DomainEvent<OrganizationCurrentState> {
  @Type(() => OrganizationId)
  readonly organizationId: OrganizationId;
  @Type(() => Participant)
  readonly owner: Participant;

  constructor(partial: Partial<ChangeOrganizationOwner>) {
    super();
    Object.assign(this, partial);
  }

  apply(state: OrganizationCurrentState): void {
    state.owner = this.owner;
  }
}
