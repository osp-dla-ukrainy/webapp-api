import * as faker from 'faker';
import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { Contact } from '../src/organization/domain/value-object/contact.entity';
import { Geolocation } from '../src/organization/domain/value-object/geolocation';
import { Organization } from '../src/organization/domain/entity/organization.entity';
import { Participant } from '../src/organization/domain/entity/participant.entity';
import { Location } from '../src/organization/domain/value-object/location.entity';
import { OrganizationId } from '../src/organization/domain/value-object/organization-id';
import { OrganizationType } from '../src/organization/domain/value-object/organization-type';
import { ParticipantId } from '../src/organization/domain/value-object/participant-id';
import { Qualification } from '../src/organization/domain/value-object/qualifications.entity';
import { OrganizationConnection } from '../src/organization/infrastructure/database/organization-database.config';

export function saveParticipant(opts?: Partial<Participant>): Promise<Participant> {
  return getRepository(Participant, OrganizationConnection).save(
    new Participant({
      id: ParticipantId.create(),
      userId: v4(),
      ...opts,
    })
  );
}

export async function saveOrganization(opts?: Partial<Organization>): Promise<Organization> {
  const participant = opts?.owner ?? (await saveParticipant());
  const owner = Object.assign(participant, { id: participant.id.valueOf });

  const organization = await getRepository(Organization, OrganizationConnection).save(
    new Organization({
      id: OrganizationId.create(),
      type: faker.random.arrayElement([OrganizationType.Ordinary, OrganizationType.SinglePerson]),
      owner,
      location: await getRepository(Location, OrganizationConnection).save(
        new Location({
          city: faker.address.city(),
          province: faker.address.county(),
          state: faker.address.state(),
          municipality: faker.address.county(),
          postcode: faker.address.zipCode('pl'),
          geolocation: new Geolocation({
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
          }),
        })
      ),
      contact: await getRepository(Contact, OrganizationConnection).save(
        new Contact({
          phone: '+48123123123',
        })
      ),
      name: faker.random.word(),
      qualifications: [],
      ...opts,
    })
  );

  const originalOrganizationId = organization.id;

  Object.assign(organization, { id: organization.id.valueOf });

  const qualification = await getRepository(Qualification, OrganizationConnection).save(
    new Qualification({
      organization,
      name: faker.random.word(),
    })
  );

  organization.qualifications.push(qualification);

  Object.assign(organization, { id: originalOrganizationId });

  return organization;
}
