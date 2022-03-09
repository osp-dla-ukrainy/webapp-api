import { Router } from 'express';
import { getOrganizationRoutes } from './organization.controller';

export const organizationRoutes = Router();

organizationRoutes.use('/organizations', getOrganizationRoutes());
