import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class AppConfig {
  static load() {
    return new AppConfig({
      app: {
        port: Number(process.env.PORT),
      },
      database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 3000,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
      },
    });
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
  };

  constructor(partial: Partial<AppConfig>) {
    Object.assign(this, partial);
  }
}
