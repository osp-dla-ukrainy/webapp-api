import { injectable } from 'inversify';
import { User } from '../entity/user';

@injectable()
export abstract class UserRepository {
  abstract findOneByFacebookId({ facebookId }: { facebookId: string }): Promise<User | undefined>;
  abstract findOneByEmail({ email }: { email: string }): Promise<User | undefined>;
  abstract save(user: User): Promise<void>;
}
