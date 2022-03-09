import { RootAggregate } from '../../../shared/events/root-aggregate';
import { OrganizationCreated } from '../event/organization-created';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { OrganizationCurrentState } from './organization-current-state';
import { Participant } from './participant';

export class Organization extends RootAggregate<OrganizationCurrentState> {
  static create({
    organizationId,
    type,
    owner,
  }: {
    organizationId: OrganizationId;
    type: OrganizationType;
    owner: Participant;
  }): Organization {
    const organization = new Organization({
      id: organizationId,
    });

    organization.apply(
      new OrganizationCreated({
        type,
        organizationId,
        ownerId: owner.id,
      })
    );

    return organization;
  }

  readonly id: OrganizationId;
  readonly currentState = new OrganizationCurrentState();

  constructor(partial: Partial<Organization>) {
    super();
    Object.assign(this, partial);
  }
}
