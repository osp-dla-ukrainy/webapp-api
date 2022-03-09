import { StatusCodes } from 'http-status-codes';
import { HttpException, HttpExceptionConstructor } from './http.exception';

export class AuthException extends HttpException {
  static createUnauthorized(partial?: Pick<HttpExceptionConstructor, 'previousException'>) {
    return new AuthException({
      message: `Authorization failed`,
      status: StatusCodes.UNAUTHORIZED,
      previousException: partial?.previousException,
    });
  }

  constructor(data: HttpExceptionConstructor) {
    super(data);
  }
}
