import { injectable } from 'inversify';
import { DomainEvent } from '../../../shared/events/domain-event';
import { EventHandler } from '../../../shared/events/event-handler';
import { Organization } from '../entity/organization';
import { OrganizationCurrentState } from '../entity/organization-current-state';
import { OrganizationId } from '../value-object/organization-id';
import { ParticipantId } from '../value-object/participant-id';

@injectable()
export abstract class OrganizationRepository implements EventHandler<DomainEvent<OrganizationCurrentState>> {
  abstract save(entity: Organization): Promise<void>;

  abstract fineOne(id: OrganizationId): Promise<Organization | undefined>;

  abstract findOneByOwner(id: ParticipantId): Promise<Organization | undefined>;

  abstract handle(event: DomainEvent<OrganizationCurrentState>): Promise<void> | void;
}
