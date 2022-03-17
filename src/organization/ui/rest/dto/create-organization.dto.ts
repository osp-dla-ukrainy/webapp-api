import { OrganizationType } from '../../../domain/value-object/organization-type';

export class CreateOrganizationRequestDto {
  readonly location: {
    readonly city: string;
    readonly municipality: string;
    readonly province: string;
    readonly state: string;
    readonly postcode: string;
  };
  readonly organizationType: OrganizationType;
  readonly contact: {
    readonly phone: string;
  };
  readonly name: string;
  readonly qualifications: string[];
}
