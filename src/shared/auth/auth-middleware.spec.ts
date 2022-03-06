import { Request, Response } from 'express';
import * as faker from 'faker';
import { init } from '../../../test/init';
import { createUser } from '../../../test/user.test-utils';
import { AuthException } from '../exception/auth.exception';
import { authMiddleware } from './auth-middleware';
import { Jwt, JwtUser } from './jwt';

describe('AuthMiddleware', () => {
  beforeAll(async () => {
    await init();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const saveMock = (opts?: { authorizationToken?: string }) => {
    process.env.JWT_SECRET = 'test';
    const user: JwtUser = createUser();
    const req = {
      headers: { authorization: `Bearer ${opts?.authorizationToken ?? Jwt.sign(user)}` },
    } as Request;
    const res = { locals: {} } as Response;
    const next = jest.fn();

    return {
      user,
      req,
      res,
      next,
    };
  };

  describe('auth success', () => {
    it('should auth user', () => {
      const { next, req, res, user } = saveMock();

      authMiddleware(req, res, next);

      expect(res.locals.user).toMatchObject({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      } as JwtUser);
    });

    it('should call next function', () => {
      const { next, req, res } = saveMock();

      authMiddleware(req, res, next);

      expect(next).toBeCalledTimes(1);
    });
  });

  it('should throw exception when token has been sign by other secret', () => {
    process.env.JWT_SECRET = faker.random.word();
    const req = { headers: { authorization: `Bearer ${Jwt.sign(createUser())}` } } as Request;
    const { next, res } = saveMock();

    expect(() => authMiddleware(req, res, next)).toThrow(AuthException);
  });
});
