import { validate, ValidationError } from 'class-validator';
import { ValidationException } from '../exception/validation.exception';

export async function validateEntity<TEntity extends Record<any, any>>(entity: TEntity) {
  const errors: ValidationError[] = await validate(entity);

  if (errors.length) {
    throw ValidationException.createEntityValidationException(errors);
  }
}
