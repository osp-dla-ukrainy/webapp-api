import { Connection, createConnection } from "typeorm";
import { Person } from "../entities/person";
import { AppConfig } from "./app-config";
import { Container } from "./ioc";

export const Entities = [
  Person,
];

export function bootstrapDatabase(): Promise<Connection> {
  const container = Container.getInstance();
  const config = container.get(AppConfig);

  return createConnection({
    type: "postgres",
    database: config.database.name,
    username: config.database.user,
    password: config.database.password,
    port: config.database.port,
    entities: Entities,
    synchronize: true,
  })
}
