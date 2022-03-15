import { Request, Response } from 'express';
import * as faker from 'faker';
import { initTestApp } from '../../../test/init.test';
import { createJwtUser } from '../../../test/user.test';
import { AuthException } from '../exception/auth.exception';
import { AuthMiddleware } from './auth-middleware';
import { Jwt, JwtUser } from './jwt';

describe('AuthMiddleware', () => {
  beforeAll(async () => {
    await initTestApp();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const saveMock = (opts?: { authorizationToken?: string }) => {
    process.env.JWT_SECRET = 'test';
    const user: JwtUser = createJwtUser();
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

      AuthMiddleware(req, res, next);

      expect(res.locals.user).toMatchObject({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      } as JwtUser);
    });

    it('should call next function', () => {
      const { next, req, res } = saveMock();

      AuthMiddleware(req, res, next);

      expect(next).toBeCalledTimes(1);
    });
  });

  it('should throw exception when token has been sign by other secret', () => {
    process.env.JWT_SECRET = faker.random.word();
    const req = { headers: { authorization: `Bearer ${Jwt.sign(createJwtUser())}` } } as Request;
    const { next, res } = saveMock();

    expect(() => AuthMiddleware(req, res, next)).toThrow(AuthException);
  });
});
