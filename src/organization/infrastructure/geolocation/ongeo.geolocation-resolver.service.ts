import { injectable } from 'inversify';
import { Config } from '../../../shared/config/config';
import { HttpClient, HttpMethod } from '../../../shared/http-client/http-client';
import { GeolocationResolverService } from '../../domain/service/geolocation-resolver.service';
import { OngeoTypes } from './ongeo.types';

@injectable()
export class OngeoGeolocationResolverService extends GeolocationResolverService {
  constructor(private readonly httpClient: HttpClient, private readonly config: Config) {
    super();
  }

  async getCoords(data: { city: string; state: string; municipality: string }): Promise<{ lat: string; lng: string }> {
    const { data: response } = await this.httpClient.sendRequest<OngeoTypes.GeolocationSearchResponse[]>({
      url: `https://address.geocoding.api.ongeo.pl/1.0/search`,
      method: HttpMethod.GET,
      config: {
        query: {
          api_key: this.config.ongeo.apiKey,
          state: data.state,
          municipality: data.municipality,
          city: data.city,
        },
      },
    });

    const [geolocationSearchResponse] = response;

    return {
      lat: geolocationSearchResponse.point.coordinates[1].toString(),
      lng: geolocationSearchResponse.point.coordinates[0].toString(),
    };
  }
}
