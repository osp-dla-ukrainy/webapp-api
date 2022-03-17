import { injectable } from 'inversify';

@injectable()
export abstract class GeolocationResolverService {
  abstract getCoords(data: {
    city: string;
    state: string;
    municipality: string;
  }): Promise<{ lat: string; lng: string }>;
}
