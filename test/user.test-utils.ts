import faker from 'faker';
import { JwtUser } from '../src/shared/auth/jwt';

export function createUser(): JwtUser {
  return {
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  };
}
