import { ValidationError as ClassValidatorError } from 'class-validator';
import { ValidationError as ExpressValidatorError } from 'express-validator/src/base';
import { StatusCodes } from 'http-status-codes';
import { ClassValidatorExceptionMapper } from '../validation/class-validator.exception-mapper';
import { HttpException, HttpExceptionConstructor } from './http.exception';

export class ValidationException extends HttpException {
  static createRequestValidationException(errors: ExpressValidatorError[]) {
    return new ValidationException({
      status: StatusCodes.BAD_REQUEST,
      message: 'Request validation failed',
      details: errors,
    });
  }

  static createEntityValidationException(errors: ClassValidatorError[]) {
    return new ValidationException({
      status: StatusCodes.BAD_REQUEST,
      message: 'Request validation failed',
      details: ClassValidatorExceptionMapper.map(errors),
    });
  }

  constructor(data: HttpExceptionConstructor) {
    super(data);
  }
}
