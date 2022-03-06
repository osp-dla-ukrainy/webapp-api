import { StatusCodes } from 'http-status-codes';

export class HttpExceptionConstructor {
  message: string;
  details?: any;
  status: StatusCodes;
  previousException?: Error;
}

export class HttpException extends Error {
  readonly details: any;
  readonly status: StatusCodes;
  readonly previousException?: Error;

  constructor({ details, message, status, previousException }: HttpExceptionConstructor) {
    super(message);
    this.details = details;
    this.status = status;
    this.previousException = previousException;
  }
}
