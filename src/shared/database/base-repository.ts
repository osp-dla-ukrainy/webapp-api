import { ClassConstructor } from 'class-transformer';
import { getConnection } from 'typeorm';

export class BaseRepository {
  static createRepository<TEntity>({
    connectionName,
    entity,
  }: {
    connectionName: string;
    entity: ClassConstructor<TEntity>;
  }) {
    return getConnection(connectionName).getRepository(entity);
  }
}
