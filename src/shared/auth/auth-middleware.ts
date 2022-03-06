import { NextFunction, Request, Response } from 'express';
import { AuthException } from '../exception/auth.exception';
import { Jwt } from './jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization.split(`${Jwt.TokenType} `);

    res.locals.user = Jwt.decode(token);

    next();
  } catch (e) {
    throw AuthException.createUnauthorized();
  }
}
