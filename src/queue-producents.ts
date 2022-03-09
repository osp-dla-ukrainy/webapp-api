import 'reflect-metadata';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import container from './container';
import { runEventProducer } from './organization/ui/queue/event.producer-queue';
import { Config } from './shared/config/config';
import { Logger } from './shared/logger';

const app = express();
const config = container.get(Config);
const logger = container.get(Logger);

config.validate().then(() => {
  app.get('/health', (req, res) => res.status(StatusCodes.OK).json({ status: 'ok' }));

  async function run() {
    await runEventProducer();
  }

  run().catch(logger.error);

  app.listen(config.app.port, () => {
    logger.log(`App listening on ${config.app.port} port`);
  });
});
