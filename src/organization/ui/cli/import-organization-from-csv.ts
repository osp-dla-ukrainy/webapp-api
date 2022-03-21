import { parse } from 'csv-parse';
import * as fs from 'fs';
import { createConnections, getConnection } from 'typeorm';
import { inspect } from 'util';
import { v4 } from 'uuid';
import container from '../../../container';
import { User } from '../../../identity/domain/entity/user';
import { IdentityConnectionName } from '../../../identity/infrastructure/database/identity-database.config';
import connectionOptions from '../../../shared/database/database-config';
import { Logger } from '../../../shared/logger';
import { Organization } from '../../domain/entity/organization.entity';
import { Participant } from '../../domain/entity/participant.entity';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { GeolocationResolverService } from '../../domain/service/geolocation-resolver.service';
import { Contact } from '../../domain/value-object/contact.entity';
import { Location } from '../../domain/value-object/location.entity';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { OrganizationType } from '../../domain/value-object/organization-type';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { Qualification } from '../../domain/value-object/qualifications.entity';
import { OrganizationConnection } from '../../infrastructure/database/organization-database.config';
import { TypeormOrganizationRepository } from '../../infrastructure/repository/typeorm.organization.repository';

/* eslint-disable no-cond-assign */

type OrganizationRecordCsv = {
  timezone: string;
  state: string;
  whatsup: string;
  nameAndSurname: string;
  phone: string;
  organizationName: string;
  age: string;
  city: string;
  municipality: string;
  province: string;
  email: string;
  facebookLink: string;
  qualifications: string;
};

function getRecords(): Promise<OrganizationRecordCsv[]> {
  const records: OrganizationRecordCsv[] = [];

  const parser = parse(fs.readFileSync('./organizations.csv'), {
    delimiter: ',',
  });

  parser.on('readable', () => {
    let record: string[];

    while ((record = parser.read()) !== null) {
      records.push({
        timezone: record[0].trim(),
        state: record[1].trim(),
        whatsup: record[2].trim(),
        nameAndSurname: record[3].trim(),
        phone: record[4].trim(),
        organizationName: record[5].trim(),
        city: record[6].trim(),
        age: record[7].trim(),
        municipality: record[8].trim(),
        province: record[9].trim(),
        email: record[10].trim().toLowerCase(),
        facebookLink: record[11].trim(),
        qualifications: record[12].trim(),
      });
    }
  });

  return new Promise<OrganizationRecordCsv[]>((resolve) => {
    parser.on('end', () => {
      resolve(records);
    });
  });
}

async function createOrganization({ owner, record }: { record: OrganizationRecordCsv; owner: Participant }) {
  const geolocationResolverService = container.get(GeolocationResolverService);
  const logger = container.get(Logger);

  let postcode: string;

  try {
    const result = await geolocationResolverService.getPostcode({
      province: '',
      city: record.city,
    });

    postcode = result.postcode;
  } catch (e) {
    logger.log(`Error occurred for record: ${record}`);

    throw new Error();
  }

  const isOrdinaryOrganization = !!record.organizationName;
  const organizationName = isOrdinaryOrganization ? record.organizationName : record.nameAndSurname;

  return Organization.createEntity({
    organizationId: new OrganizationId(v4()),
    owner,
    location: await Location.createEntity({
      city: record.city,
      province: record.province,
      municipality: record.municipality,
      postcode,
      state: record.state,
      geolocationResolverService,
    }),
    contact: Contact.createEntity({ phone: record.phone }),
    name: organizationName,
    qualifications: record.qualifications.split(',').map((q) => Qualification.createEntity({ name: q })),
    type: isOrdinaryOrganization ? OrganizationType.Ordinary : OrganizationType.SinglePerson,
  });
}

/**
 * migrate regular organization
 */
async function run() {
  await createConnections(connectionOptions);
  const records = await getRecords();

  const ordinaryOrganizations = new Map<string, OrganizationRecordCsv>();
  const singlePersonOrganization = new Map<string, OrganizationRecordCsv>();

  records.forEach((record) => {
    if (!ordinaryOrganizations.has(record.organizationName) && record.organizationName) {
      ordinaryOrganizations.set(record.organizationName, record);

      return;
    }

    if (!singlePersonOrganization.has(record.email) && !record.organizationName) {
      singlePersonOrganization.set(record.email, record);
    }
  });

  const identityQueryRunner = await getConnection(IdentityConnectionName).createQueryRunner();
  const organizationQueryRunner = await getConnection(OrganizationConnection).createQueryRunner();
  const organizationRepository: OrganizationRepository = new TypeormOrganizationRepository(organizationQueryRunner);
  const logger = container.get(Logger);

  await identityQueryRunner.startTransaction();
  await organizationQueryRunner.startTransaction();

  for (const record of new Map([...singlePersonOrganization, ...ordinaryOrganizations]).values()) {
    try {
      const [firstName, ...rest] = record.nameAndSurname.split(' ');

      const user = await identityQueryRunner.manager.getRepository(User).save(
        new User({
          email: record.email,
          firstName,
          lastName: rest[rest.length - 1],
        })
      );

      await user.validate();

      const owner = await organizationQueryRunner.manager.getRepository(Participant).save(
        Participant.createEntity({
          id: ParticipantId.create(),
          userId: user.id,
        })
      );

      const newOrganization = await createOrganization({
        owner,
        record,
      });

      await organizationRepository.save(newOrganization);
    } catch (e) {
      logger.error(`Error occurred while processing: ${inspect(record)}`);
      logger.error(e);

      await identityQueryRunner.rollbackTransaction();
      await organizationQueryRunner.rollbackTransaction();

      throw e;
    }
  }

  await organizationQueryRunner.commitTransaction();
  await identityQueryRunner.commitTransaction();
}

run();
