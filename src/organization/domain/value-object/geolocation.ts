import { IsLatitude, IsLongitude } from 'class-validator';
import { Column } from 'typeorm';
import { GeolocationResolverService } from '../service/geolocation-resolver.service';
import { Location } from './location';

export class Geolocation {
  static async createByLocation({
    geolocationResolverService,
    location,
  }: {
    location: Location;
    geolocationResolverService: GeolocationResolverService;
  }) {
    const { lat, lng } = await geolocationResolverService.getCoords({
      city: location.city,
      state: location.state,
      municipality: location.municipality,
    });

    return new Geolocation({
      lat,
      lng,
    });
  }

  @IsLatitude()
  @Column()
  lat: string;

  @IsLongitude()
  @Column()
  lng: string;

  constructor(partial: Partial<Geolocation>) {
    Object.assign(this, partial);
  }
}
