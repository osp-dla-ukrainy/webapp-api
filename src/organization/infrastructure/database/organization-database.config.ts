import { Organization } from '../../domain/entity/organization.entity';
import { Participant } from '../../domain/entity/participant.entity';
import { AvailableQualification } from '../../domain/value-object/available-qualification.entity';
import { Contact } from '../../domain/value-object/contact.entity';
import { Location } from '../../domain/value-object/location.entity';
import { Qualification } from '../../domain/value-object/qualifications.entity';
import { EventStore } from '../events/event.store';

export const OrganizationConnection = 'organization';
export const OrganizationEntities = [
  Participant,
  Organization,
  EventStore,
  Location,
  Contact,
  Qualification,
  AvailableQualification,
];
