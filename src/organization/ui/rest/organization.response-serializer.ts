import { injectable } from 'inversify';
import { Organization } from '../../domain/entity/organization.entity';
import { GetOrganizationsByQueryResponseDto } from './dto/get-organizations-by-query.response-dto';

@injectable()
export class OrganizationResponseSerializer {
  serialize({ location, contact, ...data }: Organization): GetOrganizationsByQueryResponseDto {
    return {
      name: data.name,
      location: {
        city: location.city,
        province: location.province,
        municipality: location.municipality,
        postcode: location.postcode,
        state: location.state,
      },
      contact: {
        phone: contact.phone,
      },
      qualifications: data.qualifications.map((q) => q.name),
      isVerified: data.isVerified,
    };
  }

  serializeCollection(organizations: Organization[]): GetOrganizationsByQueryResponseDto[] {
    return organizations.map((o) => this.serialize(o));
  }
}
