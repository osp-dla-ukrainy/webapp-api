import { injectable } from 'inversify';
import { Jwt, JwtUser } from '../../shared/auth/jwt';
import { Config } from '../../shared/config/config';
import { AuthException } from '../../shared/exception/auth.exception';
import { Logger } from '../../shared/logger';
import { User } from '../domain/entity/user';
import { UserRepository } from '../domain/repository/user.repository';
import { FacebookApiService } from '../domain/service/facebook-api.service';
import { FacebookTypes } from '../domain/service/facebook.types';
import { OrganizationService } from '../domain/service/organization.service';

@injectable()
export class FacebookAuthService {
  constructor(
    private readonly facebookApiService: FacebookApiService,
    private readonly userRepository: UserRepository,
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly organizationService: OrganizationService
  ) {}

  async login({ facebookAuthCode }: { facebookAuthCode: string }): Promise<{ redirectUrl: URL }> {
    try {
      const user = await this.upsertUser({ facebookAuthCode });

      const successRedirectUrl = new URL(this.config.frontendApp.loginPages.success, this.config.frontendApp.baseUrl);

      successRedirectUrl.searchParams.append('tokenType', Jwt.TokenType);
      successRedirectUrl.searchParams.append('token', Jwt.sign(JwtUser.createFromUser(user)));

      return { redirectUrl: successRedirectUrl };
    } catch (e) {
      this.logger.error(e);
      const failedRedirectUrl = new URL(this.config.frontendApp.loginPages.failed, this.config.frontendApp.baseUrl);

      return { redirectUrl: failedRedirectUrl };
    }
  }

  private async upsertUser({ facebookAuthCode }: { facebookAuthCode: string }) {
    const userData = await this.getFacebookUserData({ facebookAuthCode });

    const user = await this.userRepository.findOneByFacebookId({ facebookId: userData.id });

    if (user) {
      return user;
    }

    const newUser = User.createUserFromFacebookAuth(userData);

    await this.organizationService.createOwner({ userId: newUser.id });
    await this.userRepository.save(newUser);

    return newUser;
  }

  private async getFacebookUserData({
    facebookAuthCode,
  }: {
    facebookAuthCode: string;
  }): Promise<FacebookTypes.UserDataResponse> {
    try {
      const accessToken = await this.facebookApiService.createAccessToken({ code: facebookAuthCode });

      return this.facebookApiService.getUserData(accessToken);
    } catch (e) {
      throw AuthException.createUnauthorized({ previousException: e });
    }
  }
}
