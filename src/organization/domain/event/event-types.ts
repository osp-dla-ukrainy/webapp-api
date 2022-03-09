import { ClassConstructor } from 'class-transformer';
import { Organization } from '../entity/organization';
import { Participant } from '../entity/participant';
import { ChangeOrganizationOwner } from './change-organization-owner';
import { OrganizationCreated } from './organization-created';
import { ParticipantCreated } from './participant-created';

export const OrganizationEvents = new Map<string, ClassConstructor<any>>([
  [ChangeOrganizationOwner.name, ChangeOrganizationOwner],
  [OrganizationCreated.name, OrganizationCreated],
]);

export const ParticipantEvents = new Map<string, ClassConstructor<any>>([
  [ParticipantCreated.name, ParticipantCreated],
]);

export const EventTypes: Map<string, Map<string, ClassConstructor<any>>> = new Map([
  [Organization.name, OrganizationEvents],
  [Participant.name, ParticipantEvents],
]);
