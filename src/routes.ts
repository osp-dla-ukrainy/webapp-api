import { Router } from 'express';
import { getAuthController } from './identity/ui/auth.controller';

const routes = Router();

const identityRoues = Router();

identityRoues.use('/auth', getAuthController());

routes.use('/identity', identityRoues);

export default routes;
