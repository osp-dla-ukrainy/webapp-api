import { StatusCodes } from 'http-status-codes';

export class HttpExceptionConstructor {
  status: StatusCodes;
  details?: any;
  previousException?: Error;
}

export class HttpException extends Error {
  readonly details?: any;
  readonly status: StatusCodes;
  readonly previousException?: Error;

  constructor({ details, status, previousException }: HttpExceptionConstructor) {
    super(JSON.stringify({ details }));
    this.details = details;
    this.status = status;
    this.previousException = previousException;
  }
}
