import { Router } from 'express';
import { identityRoues } from './identity/ui/identity-routes';
import { organizationRoutes } from './organization/ui/rest/organization-routes';

const routes = Router();

routes.use('/identity', identityRoues);
routes.use('/organization', organizationRoutes);

export default routes;
