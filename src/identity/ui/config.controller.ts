import { Request, Response, Router } from 'express';
import container from '../../container';
import { Config } from '../../shared/config/config';

export class ConfigController {
  static get(req: Request, res: Response) {
    const config = container.get(Config);

    return res.json({
      facebook: {
        clientId: config.facebook.clientId,
        redirectUri: config.facebook.redirectUri,
      },
    });
  }
}

export function getConfigRoutes() {
  const router = Router();

  router.get('/', ConfigController.get);

  return router;
}
