import { Organization } from '../../domain/entity/organization';
import { Participant } from '../../domain/entity/participant';
import { Location } from '../../domain/value-object/location';
import { EventStore } from '../events/event.store';

export const OrganizationConnection = 'organization';
export const OrganizationEntities = [Participant, Organization, EventStore, Location];
