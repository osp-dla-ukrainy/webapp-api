import * as Sentry from '@sentry/node';
import { Integrations as TracingIntegrations } from '@sentry/tracing';
import cors from 'cors';
import express, { json } from 'express';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import container from './container';
import Routes from './routes';
import { Config } from './shared/config/config';
import { exceptionHandlerMiddleware } from './shared/exception/exception-handler-middleware';
import { Logger } from './shared/logger';

const config = container.get(Config);
const logger = container.get(Logger);

export const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: config.app.cors,
  })
);

app.use(json());

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

app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]')
);

app.get('/health', (req, res) => res.status(StatusCodes.OK).json({ status: 'ok' }));
app.use('/api', Routes);
app.use(exceptionHandlerMiddleware({ logger }));
