import { Application } from 'express';
import faker from 'faker';
import { StatusCodes } from 'http-status-codes';
import { Geolocation } from 'src/organization/domain/value-object/geolocation';
import request from 'supertest';
import { getRepository } from 'typeorm';
import { authHeaders } from '../../../../test/auth.test';
import { clearSchema, composeBaseOrganizationUrl, initTestApp } from '../../../../test/init.test';
import { saveOrganization, saveParticipant } from '../../../../test/organization.test';
import { createJwtUser } from '../../../../test/user.test';
import container from '../../../container';
import { nameof } from '../../../shared/utils/nameof';
import { Organization } from '../../domain/entity/organization';
import { Participant } from '../../domain/entity/participant';
import { OrganizationCreated } from '../../domain/event/organization-created';
import { GeolocationResolverService } from '../../domain/service/geolocation-resolver.service';
import { Location } from '../../domain/value-object/location';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { OrganizationType } from '../../domain/value-object/organization-type';
import { OrganizationConnection } from '../../infrastructure/database/organization-database.config';
import { EventStore } from '../../infrastructure/events/event.store';
import { CreateOrganizationRequestDto } from './dto/create-organization.dto';

describe('OrganizationController integration tests', () => {
  let app: Application;
  let geolocationResolverService: GeolocationResolverService;

  beforeAll(async () => {
    app = await initTestApp();

    geolocationResolverService = container.get(GeolocationResolverService);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    await clearSchema();
  });

  describe('POST /organizations', () => {
    const route = composeBaseOrganizationUrl('/organizations');

    const payload: CreateOrganizationRequestDto = Object.freeze({
      location: {
        city: faker.address.city(),
        province: faker.address.county(),
        state: faker.address.state(),
        municipality: faker.address.county(),
        postcode: '00-000',
      },
      organizationType: faker.random.arrayElement([
        OrganizationType.SinglePerson,
        OrganizationType.Ordinary,
      ] as OrganizationType[]),
    });

    const saveMocks = async () => {
      const jwtUser = createJwtUser();
      const participant = await saveParticipant({ userId: jwtUser.id });
      const coords = {
        lat: faker.address.latitude(),
        lng: faker.address.latitude(),
      };

      jest.spyOn(geolocationResolverService, 'getCoords').mockResolvedValueOnce(coords);

      return {
        jwtUser,
        participant,
        coords,
      };
    };

    it.each([
      {
        data: {
          location: payload.location,
          organizationType: faker.random.word(),
        } as CreateOrganizationRequestDto,
      },
      {
        data: {
          location: {},
          organizationType: payload.organizationType,
        } as CreateOrganizationRequestDto,
      },
    ])('422 - request payload validation', async (data) => {
      const response = await request(app).post(route).set(authHeaders()).send(data);

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('404 - when participant does not found', async () => {
      const response = await request(app).post(route).set(authHeaders()).send(payload);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('400 - when participant has already organization', async () => {
      const { participant, jwtUser } = await saveMocks();

      await saveOrganization({ owner: participant });

      const response = await request(app).post(route).set(authHeaders(jwtUser)).send(payload);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    describe('201', () => {
      it('should return organization id', async () => {
        const { jwtUser } = await saveMocks();

        const response = await request(app).post(route).set(authHeaders(jwtUser)).send(payload);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toMatchObject({
          organizationId: expect.any(String),
        });
      });

      it('should save organization', async () => {
        const { jwtUser, coords } = await saveMocks();

        await request(app).post(route).set(authHeaders(jwtUser)).send(payload);

        const result = await getRepository(Organization, OrganizationConnection).findOne({
          relations: [nameof<Organization>((o) => o.owner), nameof<Organization>((o) => o.location)],
        });

        expect(result).toMatchObject({
          id: expect.any(OrganizationId),
          type: OrganizationType.Ordinary,
          owner: expect.objectContaining({
            userId: jwtUser.id,
          } as Participant),
          location: expect.objectContaining({
            city: payload.location.city,
            province: payload.location.province,
            municipality: payload.location.municipality,
            postcode: payload.location.postcode,
            state: payload.location.state,
            geolocation: {
              lat: coords.lat,
              lng: coords.lng,
            } as Geolocation,
          } as Location),
        } as Organization);
      });

      it('should invoke OrganizationCreated event', async () => {
        const { jwtUser, coords } = await saveMocks();

        await request(app).post(route).set(authHeaders(jwtUser)).send(payload);

        const event = await getRepository(EventStore, OrganizationConnection).findOne();

        expect(event).toMatchObject({
          id: expect.any(String),
          type: OrganizationCreated.name,
          entity: Organization.name,
          data: {
            organizationId: expect.any(Object),
            ownerId: expect.any(Object),
            entity: Organization.name,
            location: {
              city: payload.location.city,
              province: payload.location.province,
              municipality: payload.location.municipality,
              postcode: payload.location.postcode,
              state: payload.location.state,
              geolocation: {
                lat: coords.lat,
                lng: coords.lng,
              } as Geolocation,
            },
          },
          createdAt: expect.any(Date),
        } as EventStore<OrganizationCreated>);
      });
    });
  });
});
