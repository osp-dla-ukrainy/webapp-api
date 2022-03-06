import { ValidationError as ClassValidatorError } from 'class-validator';
import { ValidationError as ExpressValidatorError } from 'express-validator/src/base';

export class ClassValidatorExceptionMapper {
  static map(validationErrors: ClassValidatorError[]): ExpressValidatorError[] {
    const constraintsErrorsFromAllChildren = validationErrors.reduce((acc, error) => {
      const mapped = this.getConstraintsFromChildren(error);

      if (mapped.length > 0) {
        acc.push(mapped.flat());
      }

      return acc;
    }, [] as ExpressValidatorError[][]);

    const constraintsErrorsFromParents = validationErrors.reduce((acc, error) => {
      if (error.constraints) {
        acc.push(this.mapFromConstraint(error));
      }

      return acc;
    }, [] as ExpressValidatorError[][]);

    return [...constraintsErrorsFromAllChildren.flat(), ...constraintsErrorsFromParents.flat()];
  }

  private static getConstraintsFromChildren(validationErrors: ClassValidatorError): ExpressValidatorError[][] {
    return (validationErrors.children || []).reduce((acc, child) => {
      if (child.constraints) {
        acc.push(this.mapFromConstraint(child, validationErrors.property).flat());
      }

      if (child.children?.length) {
        acc.push(this.getConstraintsFromChildren(child).flat());
      }

      return acc;
    }, [] as ExpressValidatorError[][]);
  }

  private static mapFromConstraint(
    errorValidation: ClassValidatorError,
    parentPropertyName?: string
  ): ExpressValidatorError[] {
    if (!errorValidation.constraints) {
      return [];
    }

    const property: string = parentPropertyName
      ? `${parentPropertyName}.${errorValidation.property}`
      : errorValidation.property;

    return Object.entries(errorValidation.constraints).map(([_, errorMessage]) => ({
      value: errorValidation.value,
      param: property,
      location: 'body',
      msg: errorMessage,
    }));
  }
}
