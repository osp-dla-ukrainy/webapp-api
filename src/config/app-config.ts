import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class AppConfig {
  static load() {
    return new AppConfig({
      app: {
        port: Number(process.env.PORT),
      },
      database: {
        host: process.env.DATBASE_HOST,
        port: Number(process.env.DATBASE_PORT) || 3000,
        user: process.env.DATBASE_USERNAME,
        password: process.env.DATBASE_PASSWORD,
        name: process.env.DATBASE_NAME,
      },
    })
  }

  readonly app: {
    readonly port: number;
  };
  readonly database: {
    readonly host: string;
    readonly port: number;
    readonly password: string;
    readonly user: string;
    readonly name: string;
  }

  constructor(partial: Partial<AppConfig>) {
    Object.assign(this, partial);
  }
}
