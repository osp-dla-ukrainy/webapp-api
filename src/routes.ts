import { Router } from "express";

const routes = Router();

routes.get('/', (req, res) => res.json({ hello: 'world' }));

export default routes;

