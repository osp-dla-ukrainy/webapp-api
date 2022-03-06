import { injectable } from 'inversify';

export enum HttpMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

export class HttpRequest {
  readonly url: string;
  readonly method: HttpMethod;
  readonly config?: {
    readonly body?: Record<any, any>;
    readonly query?: Record<any, any>;
    readonly headers?: Record<any, any>;
  };
}

export class HttpResponse<TResponseData> {
  readonly data: TResponseData;
}

@injectable()
export abstract class HttpClient {
  abstract sendRequest<TResponseData>(httpRequest: HttpRequest): Promise<HttpResponse<TResponseData>>;
}
