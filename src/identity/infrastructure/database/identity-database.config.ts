import { FacebookProfile } from '../../domain/entity/facebook-profile';
import { User } from '../../domain/entity/user';

export const IdentityEntities = [FacebookProfile, User];
export const IdentityConnectionName = 'identity';
