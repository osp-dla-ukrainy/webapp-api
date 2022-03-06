import { Router } from 'express';
import { getAuthRoutes } from './identity/ui/auth.controller';
import { getConfigRoutes } from './identity/ui/config.controller';

const routes = Router();

const identityRoues = Router();

identityRoues.use('/auth', getAuthRoutes());
identityRoues.use('/configs', getConfigRoutes());

routes.use('/identity', identityRoues);

export default routes;
