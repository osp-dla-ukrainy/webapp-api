import 'reflect-metadata';
import express from "express";
import { createConnection } from "typeorm";
import { bootstrapAdmin } from './config/admin-config'
import { AppConfig } from "./config/app-config";
import { Person } from "./entities/person";
import Routes from './routes'
import { Container } from './config/ioc';

const container = Container.getInstance();
const config = container.get(AppConfig);

const app = express();

app.set('trust proxy', 1);

createConnection({
  type: "postgres",
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  port: config.database.port,
  entities: [Person],
  synchronize: true,
}).then((connection) => {
  const {
    adminJs,
    adminRouter,
  } = bootstrapAdmin(connection);

  app.use(adminJs.options.rootPath, adminRouter);
  app.use(Routes);

  app.listen(config.app.port, () => {
    console.log('app listening on 3000 port')
  });
})

