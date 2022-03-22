import { config as DotenvConfig } from 'dotenv';

DotenvConfig({ path: './test/test.env' });
import { createConnections, getRepository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { FacebookProfile } from '../src/identity/domain/entity/facebook-profile';
import { User } from '../src/identity/domain/entity/user';
import { Organization } from '../src/organization/domain/entity/organization.entity';
import { Participant } from '../src/organization/domain/entity/participant.entity';
import { GeolocationResolverService } from '../src/organization/domain/service/geolocation-resolver.service';
import { EventStore } from '../src/organization/infrastructure/events/event.store';
import { app } from '../src/server';
import container from '../src/container';
import { FacebookApiService } from '../src/identity/domain/service/facebook-api.service';
import {
  IdentityConnectionName,
  IdentityEntities,
} from '../src/identity/infrastructure/database/identity-database.config';
import {
  OrganizationConnection,
  OrganizationEntities,
} from '../src/organization/infrastructure/database/organization-database.config';
import { Config } from '../src/shared/config/config';

async function createDatabaseConnection() {
  const config = container.get(Config);

  return createConnections([
    {
      type: 'postgres',
      host: config.database.host,
      database: 'postgres',
      username: config.database.user,
      password: config.database.password,
      port: config.database.port,
      entities: [],
      namingStrategy: new SnakeNamingStrategy(),
    },
    {
      name: IdentityConnectionName,
      type: 'postgres',
      host: config.database.host,
      database: `${IdentityConnectionName}-int`,
      username: config.database.user,
      password: config.database.password,
      port: config.database.port,
      entities: IdentityEntities,
      synchronize: false,
      migrationsRun: true,
      migrations: [`src/identity/migrations/*.ts`],
      cli: { migrationsDir: 'src/identity/migrations' },
      migrationsTransactionMode: 'each',
      namingStrategy: new SnakeNamingStrategy(),
    },
    {
      name: OrganizationConnection,
      type: 'postgres',
      host: config.database.host,
      database: `${OrganizationConnection}-int`,
      username: config.database.user,
      password: config.database.password,
      port: config.database.port,
      entities: OrganizationEntities,
      synchronize: false,
      migrationsRun: true,
      migrations: [`src/organization/migrations/*.ts`],
      cli: { migrationsDir: 'src/organization/migrations' },
      migrationsTransactionMode: 'each',
      namingStrategy: new SnakeNamingStrategy(),
    },
  ]);
}

export async function initTestApp() {
  container.rebind(FacebookApiService).toConstantValue({
    createAccessToken: jest.fn(),
    getUserData: jest.fn,
  } as unknown as FacebookApiService);

  container.rebind(GeolocationResolverService).toConstantValue({
    getCoords: jest.fn(),
    getPostcode: jest.fn(),
  });

  await createDatabaseConnection();

  return app;
}

export async function clearSchema() {
  await getRepository(Organization, OrganizationConnection).createQueryBuilder().delete().execute();
  await getRepository(Participant, OrganizationConnection).createQueryBuilder().delete().execute();
  await getRepository(EventStore, OrganizationConnection).createQueryBuilder().delete().execute();
  await getRepository(User, IdentityConnectionName).createQueryBuilder().delete().execute();
  await getRepository(FacebookProfile, IdentityConnectionName).createQueryBuilder().delete().execute();
}

export function composeBaseOrganizationUrl(endpoint: string) {
  return `/api/organization${endpoint}`;
}
