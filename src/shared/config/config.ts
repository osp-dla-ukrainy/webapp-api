import { plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validate, ValidateNested } from 'class-validator';
import { config as dotenvConfig } from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../exception/http.exception';
import { ClassValidatorExceptionMapper } from '../validation/class-validator.exception-mapper';

dotenvConfig();

export enum AppEnv {
  Test = 'test',
  Dev = 'dev',
  Staging = 'staging',
  Production = 'production',
}

class SentryConfig {
  @IsString()
  readonly dsn: string;
}

class FrontendAppLoginPagesConfig {
  @IsString()
  readonly success: string;
  @IsString()
  readonly failed: string;
}

class FrontendAppConfig {
  @IsString()
  readonly baseUrl: string;
  @ValidateNested()
  readonly loginPages: FrontendAppLoginPagesConfig;
}

class JwtConfig {
  @IsString()
  readonly secret: string;
  @IsString()
  readonly expirationTime: string;
}

class AdminConfig {
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
}

class AppConfig {
  @IsNumber()
  readonly port: number;
  @IsEnum(AppEnv)
  readonly env: AppEnv;
  @IsNotEmpty()
  readonly cors: string | RegExp;
}

class DatabaseConfig {
  @IsString()
  readonly host: string;
  @IsNumber()
  readonly port: number;
  @IsString()
  readonly password: string;
  @IsString()
  readonly user: string;
}

class FacebookConfig {
  @IsNumber()
  readonly clientId: number;
  @IsString()
  readonly clientSecret: string;
  @IsString()
  readonly redirectUri: string;
}

class RabbitConfig {
  @IsString()
  readonly host: string;
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
}

class OngeoConfig {
  @IsString()
  readonly apiKey: string;
}

export class Config {
  static load() {
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL;

    return plainToInstance(Config, {
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
        env: process.env.NODE_ENV?.toLowerCase() as AppEnv,
        cors: new RegExp(process.env.CORS_REGEXP),
      },
      database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
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
      rabbit: {
        host: process.env.RABBIT_HOST,
        username: process.env.RABBIT_USERNAME,
        password: process.env.RABBIT_PASSWORD,
      },
      ongeo: {
        apiKey: process.env.ONGEO_API_KEY,
      },
    } as Config);
  }

  @ValidateNested()
  @Type(() => SentryConfig)
  readonly sentry: SentryConfig;

  @ValidateNested()
  @Type(() => FrontendAppConfig)
  readonly frontendApp: FrontendAppConfig;

  @ValidateNested()
  @Type(() => JwtConfig)
  readonly jwt: JwtConfig;

  @ValidateNested()
  @Type(() => AdminConfig)
  readonly admin: AdminConfig;

  @ValidateNested()
  @Type(() => AppConfig)
  readonly app: AppConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  readonly database: DatabaseConfig;

  @ValidateNested()
  @Type(() => FacebookConfig)
  readonly facebook: FacebookConfig;

  @ValidateNested()
  @Type(() => RabbitConfig)
  readonly rabbit: RabbitConfig;

  @ValidateNested()
  @Type(() => OngeoConfig)
  readonly ongeo: OngeoConfig;

  constructor(partial: Config) {
    Object.assign(this, partial);
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length) {
      throw new HttpException({
        details: {
          message: 'Wrong app configuration',
          errors: ClassValidatorExceptionMapper.map(errors),
        },
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
  }
}
