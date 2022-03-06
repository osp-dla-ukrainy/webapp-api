import { captureException } from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inspect } from 'util';
import { Logger } from '../logger';
import { HttpException } from './http.exception';

export function exceptionHandlerMiddleware({ logger }: { logger: Logger }) {
  return (err: any | Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(inspect(err));
    const isHttpException = err instanceof HttpException;
    const message = isHttpException ? err.message : 'Internal server error';
    const details = isHttpException ? err.details : undefined;
    const status = isHttpException ? err.status : StatusCodes.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      captureException(err);
    }

    return res.status(status).json({
      details,
      message,
    });
  };
}
