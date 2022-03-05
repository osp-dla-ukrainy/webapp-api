import jwt from 'jsonwebtoken';
import { User } from '../../identity/domain/entity/user';
import { AuthException } from '../exception/auth.exception';

export class JwtUser {
  static createFromUser(user: User): JwtUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

export class Jwt {
  static readonly TokenType = 'Bearer';

  static sign(jwtUser: JwtUser): string {
    return jwt.sign(jwtUser, this.getSecret(), { expiresIn: process.env.JWT_EXPIRATION_TIME });
  }

  static decode(token: string): JwtUser {
    try {
      const payload = jwt.verify(token, this.getSecret()) as JwtUser & { iat: number; exp: number };

      return {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    } catch (e) {
      throw AuthException.createUnauthorized();
    }
  }

  private static getSecret() {
    return process.env.JWT_SECRET;
  }
}
