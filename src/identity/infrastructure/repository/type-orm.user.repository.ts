import { ClassConstructor } from 'class-transformer';
import { injectable } from 'inversify';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/database/base-repository';
import { IdentityConnectionName } from '../database/identity-database.config';
import { nameof } from '../../../shared/utils/nameof';
import { FacebookProfile } from '../../domain/entity/facebook-profile';
import { User } from '../../domain/entity/user';
import { UserRepository } from '../../domain/repository/user.repository';

@injectable()
export class TypeOrmUserRepository extends UserRepository {
  private readonly repository: Repository<User>;
  private readonly entity: ClassConstructor<User> = User;

  constructor() {
    super();
    this.repository = BaseRepository.createRepository({
      connectionName: IdentityConnectionName,
      entity: this.entity,
    });
  }

  findOneByFacebookId({ facebookId }: { facebookId: string }): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        facebookProfile: {
          facebookId,
        },
      },
      relations: [nameof<User>((u) => u.facebookProfile)],
    });
  }

  async save(user: User): Promise<void> {
    await getConnection(IdentityConnectionName).transaction(async (entityManager) => {
      const userRepo = entityManager.getRepository(User);
      const facebookProfileRepo = entityManager.getRepository(FacebookProfile);

      await facebookProfileRepo.save(user.facebookProfile);
      await userRepo.save(user);
    });
  }

  findOneByEmail({ email }: { email: string }): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        email,
      },
      relations: [nameof<User>((u) => u.facebookProfile)],
    });
  }
}
