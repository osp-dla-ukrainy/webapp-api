import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export enum AppEnv {
  Dev = 'dev',
  Staging = 'staging',
  Production = 'production',
}

export class AppConfig {
  static load() {
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL;

    return new AppConfig({
      sentry: {
        dsn: process.env.SENTRY_DSN,
      },
      frontendApp: {
        baseUrl: frontendBaseUrl,
        loginPages: {
          success: process.env.FRONTEND_LOGIN_PAGES_SUCCESS,
          failed: process.env.FRONTEND_LOGIN_PAGES_FAILED,
        },
      },
      admin: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      },
      app: {
        port: Number(process.env.PORT),
        env: process.env.NODE_ENV.toLowerCase() as AppEnv,
      },
      database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
      },
      facebook: {
        clientId: Number(process.env.FACEBOOK_CLIENT_ID),
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        redirectUri: process.env.FACEBOOK_REDIRECT_URL,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expirationTime: process.env.JWT_EXPIRATION_TIME,
      },
    });
  }

  readonly sentry: {
    readonly dsn: string;
  };
  readonly frontendApp: {
    readonly baseUrl: string;
    readonly loginPages: {
      readonly success: string;
      readonly failed: string;
    };
  };
  readonly jwt: {
    readonly secret: string;
    readonly expirationTime: string;
  };
  readonly admin: {
    readonly username: string;
    readonly password: string;
  };
  readonly app: {
    readonly port: number;
    readonly env: AppEnv;
  };
  readonly database: {
    readonly host: string;
    readonly port: number;
    readonly password: string;
    readonly user: string;
    readonly name: string;
  };
  readonly facebook: {
    readonly clientId: number;
    readonly clientSecret: string;
    readonly redirectUri: string;
  };

  constructor(partial: AppConfig) {
    Object.assign(this, partial);
  }
}
