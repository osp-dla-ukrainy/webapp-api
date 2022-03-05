import { IsNumberString } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * BaseEntity has been used for AdminJs purposes
 */
@Unique(['facebookId'])
@Entity()
export class FacebookProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'facebook_profile_id' })
  id: string;

  @Column()
  @IsNumberString()
  facebookId: string;

  constructor(partial: Partial<FacebookProfile>) {
    super();
    Object.assign(this, partial);
  }
}
