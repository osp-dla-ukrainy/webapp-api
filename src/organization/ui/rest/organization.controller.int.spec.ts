import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { getRepository } from 'typeorm';
import { authHeaders } from '../../../../test/auth.test';
import { clearSchema, composeBaseOrganizationUrl, initTestApp } from '../../../../test/init.test';
import { saveParticipant } from '../../../../test/organization.test';
import { createJwtUser } from '../../../../test/user.test';
import { nameof } from '../../../shared/utils/nameof';
import { Organization } from '../../domain/entity/organization';
import { Participant } from '../../domain/entity/participant';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { OrganizationType } from '../../domain/value-object/organization-type';
import { OrganizationConnection } from '../../infrastructure/database/organization-database.config';

describe('OrganizationController integration tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await initTestApp();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    await clearSchema();
  });

  describe('POST /organizations', () => {
    const route = composeBaseOrganizationUrl('/organizations');

    it('404 - when participant does not found', async () => {
      const response = await request(app).post(route).set(authHeaders()).send({});

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    describe('201', () => {
      const saveMocks = async () => {
        const jwtUser = createJwtUser();

        await saveParticipant({ userId: jwtUser.id });

        return { jwtUser };
      };

      it('should return organization id', async () => {
        const { jwtUser } = await saveMocks();

        const response = await request(app).post(route).set(authHeaders(jwtUser)).send({});

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toMatchObject({
          organizationId: expect.any(String),
        });
      });

      it('should save organization', async () => {
        const { jwtUser } = await saveMocks();

        await request(app).post(route).set(authHeaders(jwtUser)).send({});

        const result = await getRepository(Organization, OrganizationConnection).findOne({
          relations: [nameof<Organization>((o) => o.owner)],
        });

        expect(result).toMatchObject({
          id: expect.any(OrganizationId),
          type: OrganizationType.Ordinary,
          owner: expect.objectContaining({
            userId: jwtUser.id,
          } as Participant),
        } as Organization);
      });
    });
  });
});
