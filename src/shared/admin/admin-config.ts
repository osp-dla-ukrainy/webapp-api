import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/typeorm';
import { validate } from 'class-validator';
import { Router } from 'express';
import session from 'express-session';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { container } from '../../ioc/container';
import { AppConfig } from '../config/app-config';
import {
  IdentityConnectionName,
  IdentityEntities,
} from '../../identity/infrastructure/database/identity-database.config';

const AdminJS = require('adminjs');

export function bootstrapAdmin(connections: Connection[]) {
  const config = container.get(AppConfig);

  Resource.validate = validate;
  AdminJS.registerAdapter({
    Database,
    Resource,
  });

  const identityDbConnection = connections.find((conn) => conn.name === IdentityConnectionName);

  IdentityEntities.forEach((entity) => entity.useConnection(identityDbConnection));

  const adminJs = new AdminJS({
    databases: connections,
    resources: [],
    rootPath: '/admin',
  });

  const router = Router();
  const ADMIN = Object.freeze({
    email: config.admin.username,
    password: config.admin.password,
  });

  AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        if (ADMIN.password === password && ADMIN.email === email.toLowerCase()) {
          return ADMIN;
        }

        return undefined;
      },
      cookieName: 'adminjs',
      cookiePassword: 'somePassword',
    },
    router,
    {
      genid: () => v4(),
      name: 'codeil',
      secret: 'something',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
    }
  );

  router.use((req, res, next) => {
    const requestSession: session.Session & Partial<session.SessionData> & Record<any, any> = req.session;

    if (requestSession && requestSession.admin) {
      requestSession.adminUser = requestSession.admin;
    }
    next();
  });

  const adminRouter = AdminJSExpress.buildRouter(adminJs, router);

  return {
    adminRouter,
    adminJs,
  };
}
