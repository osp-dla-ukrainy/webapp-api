import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import container from '../../container';
import {
  IdentityConnectionName,
  IdentityEntities,
} from '../../identity/infrastructure/database/identity-database.config';
import {
  OrganizationConnection,
  OrganizationEntities,
} from '../../organization/infrastructure/database/organization-database.config';
import { Config } from '../config/config';

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
    name: OrganizationConnection,
    type: 'postgres',
    host: config.database.host,
    database: OrganizationConnection,
    username: config.database.user,
    password: config.database.password,
    port: config.database.port,
    entities: OrganizationEntities,
    synchronize: false,
    migrationsRun: true,
    migrations: [`${__dirname}/../../organization/migrations/*.js`],
    cli: { migrationsDir: 'src/organization/migrations' },
    migrationsTransactionMode: 'each',
    namingStrategy: new SnakeNamingStrategy(),
  },
];

export default connectionOptions;
