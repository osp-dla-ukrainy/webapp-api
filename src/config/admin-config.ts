import AdminJSExpress from "@adminjs/express";
import { Database, Resource } from '@adminjs/typeorm';
import { validate } from "class-validator";
import { Router } from "express";
import session from "express-session";
import { Connection } from "typeorm";
import { v4 } from "uuid";
import { Person } from "../entities/person";
import { Entities } from "./database-config";
const AdminJS = require("adminjs");

export function bootstrapAdmin(connection: Connection) {
  Resource.validate = validate;
  AdminJS.registerAdapter({
    Database,
    Resource,
  });

  Entities.forEach((entity) => entity.useConnection(connection))

  const adminJs = new AdminJS({
    databases: [connection],
    resources: [
      {
        resource: Person,
        options: { parent: { name: 'foobar' } },
      },
    ],
    rootPath: '/admin',
  });

  const router = Router()
  const ADMIN = Object.freeze({
    email: 'test@example.com',
    password: 'password',
  });

  AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email.toLowerCase()) {
        return ADMIN
      }

      return undefined
    },
    cookieName: 'adminjs',
    cookiePassword: 'somePassword',
  }, router, {
    genid: () => v4(),
    name: 'codeil',
    secret: 'something',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: (1000 * 60 * 100),
    },
  });

  router.use((req, res, next) => {
    const requestSession: session.Session & Partial<session.SessionData> & Record<any, any> = req.session;

    if (requestSession && requestSession.admin) {
      requestSession.adminUser = requestSession.admin
    }
    next();
  });

  const adminRouter = AdminJSExpress.buildRouter(adminJs, router);

  return {
    adminRouter,
    adminJs,
  };
}
