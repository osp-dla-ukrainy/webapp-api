import { body, query } from 'express-validator';
import container from '../../../container';
import { validationMiddleware } from '../../../shared/validation/validation-middleware';
import { AvailableQualificationRepository } from '../../domain/repository/available-qualification.repository';
import { OrganizationType } from '../../domain/value-object/organization-type';
import { NAME_REGEXP } from '../../infrastructure/validator/regexp';

export class OrganizationRequestValidator {
  static create = [
    body('location').isObject(),
    body('location.city').isString().trim().matches(NAME_REGEXP).isLength({ min: 1 }),
    body('location.municipality').isString().trim().matches(NAME_REGEXP).isLength({ min: 1 }),
    body('location.province').isString().trim().matches(NAME_REGEXP).isLength({ min: 1 }),
    body('location.state').isString().trim().matches(NAME_REGEXP).isLength({ min: 1 }),
    body('location.postcode').isPostalCode('PL').trim(),
    body('organizationType').isIn([OrganizationType.SinglePerson, OrganizationType.Ordinary] as OrganizationType[]),
    body('contact').isObject(),
    body('contact.phone').isMobilePhone('any'),
    body('name').isString().matches(NAME_REGEXP).trim(),
    body('qualifications')
      .isArray()
      .custom(async (input: string[]) => {
        const availableQualifications = (await container.get(AvailableQualificationRepository).findAll()).map(
          (aq) => aq.name
        );

        const uniqQualifications = Array.from(new Set([...input]));

        return uniqQualifications.every((q) => availableQualifications.includes(q));
      })
      .customSanitizer((input) => {
        if (Array.isArray(input)) {
          return Array.from(new Set([...input]));
        }

        return [];
      }),
    body('qualifications.*').trim(),
    validationMiddleware,
  ];

  static getByQuery = [
    query('name').isString().optional(),
    query('page')
      .isInt()
      .optional()
      .customSanitizer((input) => Number(input)),
    query('limit')
      .isInt()
      .optional()
      .customSanitizer((input) => Number(input)),
    validationMiddleware,
  ];
}
