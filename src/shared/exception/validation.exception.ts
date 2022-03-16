import { ValidationError as ClassValidatorError } from 'class-validator';
import { ValidationError as ExpressValidatorError } from 'express-validator/src/base';
import { StatusCodes } from 'http-status-codes';
import { ClassValidatorExceptionMapper } from '../validation/class-validator.exception-mapper';
import { HttpException, HttpExceptionConstructor } from './http.exception';

export class ValidationException extends HttpException {
  static createRequestValidationException(errors: ExpressValidatorError[]) {
    return new ValidationException({
      status: StatusCodes.UNPROCESSABLE_ENTITY,
      details: {
        message: 'Request validation failed',
        errors,
      },
    });
  }

  static createEntityValidationException(errors: ClassValidatorError[]) {
    return new ValidationException({
      status: StatusCodes.BAD_REQUEST,
      details: {
        message: 'Request validation failed',
        errors: ClassValidatorExceptionMapper.map(errors),
      },
    });
  }

  constructor(data: HttpExceptionConstructor) {
    super(data);
  }
}
