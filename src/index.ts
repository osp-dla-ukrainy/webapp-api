import 'reflect-metadata';
import './shared/events/event-type.metadata-storage';
import * as Sentry from '@sentry/node';
import express from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { createConnections } from 'typeorm';
import { Integrations as TracingIntegrations } from '@sentry/tracing';
import container from './container';
import Routes from './routes';
import { bootstrapAdmin } from './shared/admin/admin-config';
import { Config } from './shared/config/config';
import connectionOptions from './shared/database/database-config';
import { exceptionHandlerMiddleware } from './shared/exception/exception-handler-middleware';
import { Logger } from './shared/logger';

const config = container.get(Config);
const logger = container.get(Logger);

const app = express();

config.validate().then(() => {
  app.set('trust proxy', 1);

  Sentry.init({
    environment: config.app.env,
    dsn: config.sentry.dsn,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new TracingIntegrations.Express({
        app,
      }),
    ],
    tracesSampler: (samplingContext) => (samplingContext.request.url.includes('/health') ? 0 : 0.1),
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  createConnections(connectionOptions).then((connections) => {
    const { adminJs, adminRouter } = bootstrapAdmin(connections);

    app.use(
      morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]')
    );
    app.use(adminJs.options.rootPath, adminRouter);
    app.get('/health', (req, res) => res.status(StatusCodes.OK).json({ status: 'ok' }));
    app.use('/api', Routes);
    app.use(exceptionHandlerMiddleware({ logger }));

    app.listen(config.app.port, () => {
      logger.log('App listening on 3000 port');
    });
  });
});
