import 'reflect-metadata';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import container from './container';
import { runPresentationConsumer } from './organization/ui/queue/presentation.consumer-queue';
import { Config } from './shared/config/config';
import { Logger } from './shared/logger';

const app = express();
const config = container.get(Config);
const logger = container.get(Logger);

config.validate().then(() => {
  app.get('/health', (req, res) => res.status(StatusCodes.OK).json({ status: 'ok' }));

  async function run() {
    try {
      await runPresentationConsumer();
    } catch (e) {
      logger.error(e);
    }
  }

  run().catch(logger.error);

  app.listen(config.app.port, () => {
    logger.log(`App listening on ${config.app.port} port`);
  });
});
