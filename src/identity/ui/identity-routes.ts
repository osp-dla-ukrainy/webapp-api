import { Router } from 'express';
import { getAuthRoutes } from './auth.controller';
import { getConfigRoutes } from './config.controller';

export const identityRoues = Router();

identityRoues.use('/auth', getAuthRoutes());
identityRoues.use('/configs', getConfigRoutes());
