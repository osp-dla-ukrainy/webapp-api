import { OrganizationType } from '../value-object/organization-type';
import { Participant } from './participant';

export class OrganizationCurrentState {
  owner: Participant;
  type: OrganizationType;
}
