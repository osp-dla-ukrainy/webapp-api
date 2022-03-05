import axios from 'axios';
import { injectable } from 'inversify';
import { HttpClient, HttpRequest, HttpResponse } from './http-client';

@injectable()
export class AxiosHttpClient extends HttpClient {
  async sendRequest<TResponse>(httpRequest: HttpRequest): Promise<HttpResponse<TResponse>> {
    const { data } = await axios.request({
      url: httpRequest.url,
      method: httpRequest.method,
      params: httpRequest.config?.query,
      headers: httpRequest.config?.headers,
      data: httpRequest.config?.body,
    });

    return { data };
  }
}
