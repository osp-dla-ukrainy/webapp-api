import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import container from '../../container';
import {
  OrganizationReadableConnection,
  OrganizationReadableEntities,
  OrganizationWritableConnection,
  OrganizationWritableEntities,
} from '../../organization/infrastructure/database/organization-database.config';
import { Config } from '../config/config';
import {
  IdentityConnectionName,
  IdentityEntities,
} from '../../identity/infrastructure/database/identity-database.config';

const config = container.get(Config);

const connectionOptions: ConnectionOptions[] = [
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
    database: IdentityConnectionName,
    username: config.database.user,
    password: config.database.password,
    port: config.database.port,
    entities: IdentityEntities,
    synchronize: false,
    migrationsRun: true,
    migrations: [`${__dirname}/../../identity/migrations/*.js`],
    cli: { migrationsDir: 'src/identity/migrations' },
    migrationsTransactionMode: 'each',
    namingStrategy: new SnakeNamingStrategy(),
  },
  {
    name: OrganizationWritableConnection,
    type: 'postgres',
    host: config.database.host,
    database: OrganizationWritableConnection,
    username: config.database.user,
    password: config.database.password,
    port: config.database.port,
    entities: OrganizationWritableEntities,
    synchronize: false,
    migrationsRun: true,
    migrations: [`${__dirname}/../../organization/migrations/write/*.js`],
    cli: { migrationsDir: 'src/organization/migrations/write' },
    migrationsTransactionMode: 'each',
    namingStrategy: new SnakeNamingStrategy(),
  },
  {
    name: OrganizationReadableConnection,
    type: 'postgres',
    host: config.database.host,
    database: OrganizationReadableConnection,
    username: config.database.user,
    password: config.database.password,
    port: config.database.port,
    entities: OrganizationReadableEntities,
    synchronize: false,
    migrationsRun: true,
    migrations: [`${__dirname}/../../organization/migrations/read/*.js`],
    cli: { migrationsDir: 'src/organization/migrations/read' },
    migrationsTransactionMode: 'each',
    namingStrategy: new SnakeNamingStrategy(),
  },
];

export default connectionOptions;
