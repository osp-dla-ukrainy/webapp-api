import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { validateEntity } from '../../../shared/validation/validate-entity';
import { FacebookTypes } from '../service/facebook.types';
import { FacebookProfile } from './facebook-profile';

/**
 * BaseEntity has been used for AdminJs purposes
 */
@Entity()
export class User extends BaseEntity {
  static createUserFromFacebookAuth(userData: FacebookTypes.UserDataResponse) {
    return new User({
      id: v4(),
      facebookProfile: new FacebookProfile({
        facebookId: userData.id,
      }),
      email: userData.email.trim().toLowerCase(),
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
  }

  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @OneToOne(() => FacebookProfile)
  @JoinColumn()
  @ValidateNested()
  facebookProfile: FacebookProfile;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  async validate() {
    await validateEntity(this);
  }

  isConnectedWithFacebookProfile() {
    return !!this.facebookProfile;
  }

  connectWithFacebook({ facebookId }: { facebookId: string }) {
    this.facebookProfile = new FacebookProfile({ facebookId });
  }
}
