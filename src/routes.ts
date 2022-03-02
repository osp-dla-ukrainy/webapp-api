import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const routes = Router();

routes.get('/health', (req, res) => res.status(StatusCodes.OK).json({ status: 'ok' }));

export default routes;
