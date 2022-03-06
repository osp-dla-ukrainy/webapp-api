import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';
import { createConnections } from 'typeorm';
import container from './ioc/container';
import Routes from './routes';
import { bootstrapAdmin } from './shared/admin/admin-config';
import { AppConfig } from './shared/config/app-config';
import connectionOptions from './shared/database/database-config';
import { exceptionHandlerMiddleware } from './shared/exception/exception-handler-middleware';
import { Logger } from './shared/logger';

const config = container.get(AppConfig);
const logger = container.get(Logger);

const app = express();

app.set('trust proxy', 1);

createConnections(connectionOptions).then((connections) => {
  const { adminJs, adminRouter } = bootstrapAdmin(connections);

  app.use(adminJs.options.rootPath, adminRouter);
  app.get('/health', (req, res) => res.status(StatusCodes.OK).json({ status: 'ok' }));
  app.use('/api', Routes);
  app.use(exceptionHandlerMiddleware({ logger }));

  app.listen(config.app.port, () => {
    logger.log('app listening on 3000 port');
  });
});
