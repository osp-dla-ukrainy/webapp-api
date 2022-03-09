import { StatusCodes } from 'http-status-codes';

export class HttpExceptionConstructor {
  message: string;
  status: StatusCodes;
  details?: any;
  previousException?: Error;
}

export class HttpException extends Error {
  readonly details?: any;
  readonly status: StatusCodes;
  readonly previousException?: Error;

  constructor({ details, message, status, previousException }: HttpExceptionConstructor) {
    super(message);
    console.log(details);
    this.details = details;
    this.status = status;
    this.previousException = previousException;
  }
}
