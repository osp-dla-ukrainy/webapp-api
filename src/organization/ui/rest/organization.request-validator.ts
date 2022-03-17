import { body } from 'express-validator';
import { validationMiddleware } from '../../../shared/validation/validation-middleware';
import { OrganizationType } from '../../domain/value-object/organization-type';

const AddressRegexp = /^[a-zA-Z]+\p{L}+(?:[\s-][a-zA-Z]+)*\p{L}+$/u;

export class OrganizationRequestValidator {
  static create = [
    body('location').isObject(),
    body('location.city').isString().trim().matches(AddressRegexp).isLength({ min: 1 }),
    body('location.municipality').isString().trim().matches(AddressRegexp).isLength({ min: 1 }),
    body('location.province').isString().trim().matches(AddressRegexp).isLength({ min: 1 }),
    body('location.state').isString().trim().matches(AddressRegexp).isLength({ min: 1 }),
    body('location.postcode').isPostalCode('PL').trim(),
    body('organizationType').isIn([OrganizationType.SinglePerson, OrganizationType.Ordinary] as OrganizationType[]),
    validationMiddleware,
  ];
}
