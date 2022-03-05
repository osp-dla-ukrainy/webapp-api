import { injectable } from 'inversify';
import { AppConfig } from '../../../shared/config/app-config';
import { HttpClient, HttpMethod } from '../../../shared/http-client/http-client';
import { FacebookTypes } from './facebook.types';

@injectable()
export class FacebookApiService {
  constructor(private readonly httpClient: HttpClient, private readonly appConfig: AppConfig) {}

  async createAccessToken({ code }: { code: string }): Promise<FacebookTypes.OAuthAccessTokenResponse> {
    const { data } = await this.httpClient.sendRequest<{ access_token: string }>({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: HttpMethod.GET,
      config: {
        query: {
          client_id: this.appConfig.facebook.clientId,
          client_secret: this.appConfig.facebook.clientSecret,
          redirect_uri: this.appConfig.facebook.redirectUri,
          code,
        },
      },
    });

    return {
      accessToken: data.access_token,
    };
  }

  async getUserData({ accessToken }: FacebookTypes.OAuthAccessTokenResponse): Promise<FacebookTypes.UserDataResponse> {
    const fields: Array<keyof FacebookTypes.UserDataRawResponse> = ['id', 'email', 'first_name', 'last_name'];

    const { data } = await this.httpClient.sendRequest<FacebookTypes.UserDataRawResponse>({
      url: 'https://graph.facebook.com/me',
      method: HttpMethod.GET,
      config: {
        query: {
          fields: fields.join(','),
          access_token: accessToken,
        },
      },
    });

    return {
      id: data.id,
      firstName: data.first_name,
      email: data.email,
      lastName: data.last_name,
    };
  }
}
