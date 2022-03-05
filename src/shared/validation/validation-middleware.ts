import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationException } from '../exception/validation.exception';

export function validationMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw ValidationException.createRequestValidationException(errors.array());
  }

  next();
}
