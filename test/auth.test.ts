import { Jwt, JwtUser } from '../src/shared/auth/jwt';
import { createJwtUser } from './user.test';

export function authHeaders(user: JwtUser = createJwtUser()) {
  const jwt = Jwt.sign(user);

  return {
    Authorization: `Bearer ${jwt}`,
  };
}
