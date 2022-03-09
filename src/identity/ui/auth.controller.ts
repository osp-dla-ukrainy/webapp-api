import { Request, Response, Router } from 'express';
import { matchedData, query } from 'express-validator';
import { injectable } from 'inversify';
import container from '../../container';
import { validationMiddleware } from '../../shared/validation/validation-middleware';
import { FacebookAuthService } from '../application/facebook-auth.service';

@injectable()
export class AuthController {
  static async facebookAuth(req: Request, res: Response) {
    const facebookAuthService = container.get(FacebookAuthService);
    const data = matchedData(req);

    const { redirectUrl } = await facebookAuthService.login({ facebookAuthCode: data.code });

    return res.redirect(redirectUrl.toString());
  }
}

export function getAuthRoutes() {
  const router = Router();

  router.get('/facebook/callback', query('code').isString(), validationMiddleware, AuthController.facebookAuth);

  return router;
}
