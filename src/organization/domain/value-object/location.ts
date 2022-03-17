import { IsPostalCode, IsString, ValidateNested } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GeolocationResolverService } from '../service/geolocation-resolver.service';
import { Geolocation } from './geolocation';

@Entity()
export class Location extends BaseEntity {
  static async createEntity(data: {
    readonly city: string;
    readonly province: string;
    readonly municipality: string;
    readonly postcode: string;
    readonly state: string;
    readonly geolocationResolverService: GeolocationResolverService;
  }) {
    const location = new Location({
      city: data.city,
      municipality: data.municipality,
      province: data.province,
      state: data.state,
      postcode: data.postcode,
    });

    location.geolocation = await Geolocation.createByLocation({
      location,
      geolocationResolverService: data.geolocationResolverService,
    });

    return location;
  }

  @PrimaryGeneratedColumn('uuid', { name: 'location_id' })
  private id: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  municipality: string;

  @IsPostalCode()
  @Column()
  postcode: string;

  @IsString()
  @Column()
  state: string;

  @ValidateNested()
  @Column(() => Geolocation)
  geolocation: Geolocation;

  constructor(partial: Partial<Location>) {
    super();
    Object.assign(this, partial);
  }
}
