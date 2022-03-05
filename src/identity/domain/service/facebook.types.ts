export namespace FacebookTypes {
  export class OAuthAccessTokenResponse {
    readonly accessToken: string;
  }

  export class UserDataResponse {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
  }

  export class UserDataRawResponse {
    readonly id: string;
    readonly email: string;
    readonly first_name: string;
    readonly last_name: string;
  }
}
