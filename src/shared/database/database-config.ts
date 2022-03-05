import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import container from '../../ioc/container';
import { AppConfig } from '../config/app-config';
import {
  IdentityConnectionName,
  IdentityEntities,
} from '../../identity/infrastructure/database/identity-database.config';

const config = container.get(AppConfig);

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
];

export default connectionOptions;
