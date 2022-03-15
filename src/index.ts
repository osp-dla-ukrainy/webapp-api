import 'express-async-errors';
import 'reflect-metadata';
import { createConnections } from 'typeorm';
import container from './container';
import { app } from './server';
import { bootstrapAdmin } from './shared/admin/admin-config';
import { Config } from './shared/config/config';
import connectionOptions from './shared/database/database-config';
import './shared/events/event-type.metadata-storage';
import { Logger } from './shared/logger';

const config = container.get(Config);
const logger = container.get(Logger);

config.validate().then(async () => {
  const connections = await createConnections(connectionOptions);

  const { adminJs, adminRouter } = bootstrapAdmin(connections);

  app.use(adminJs.options.rootPath, adminRouter);

  app.listen(config.app.port, () => {
    logger.log(`App listen on ${config.app.port} PORT`);
  });
});
