import { injectable } from 'inversify';
import { getRepository, Repository } from 'typeorm';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { SentEvent } from '../../domain/event/sent-event';
import { SentEventRepository } from '../events/sent-event.repository';
import { OrganizationWritableConnection } from '../database/organization-database.config';
import { EventStore } from '../events/event.store';

@injectable()
export class TypeormSentEventRepository extends SentEventRepository {
  private readonly repository: Repository<SentEvent>;

  constructor() {
    super();
    this.repository = getRepository(SentEvent, OrganizationWritableConnection);
  }

  async findNewest(): Promise<SentEvent | undefined> {
    return this.repository
      .createQueryBuilder('se')
      .innerJoinAndSelect(
        nameofWithAlias<SentEvent>((se) => se.eventStore),
        'o'
      )
      .orderBy(
        nameofWithAlias<EventStore<any>>((o) => o.version),
        'DESC'
      )
      .getOne();
  }

  async save(entity: SentEvent): Promise<void> {
    await this.repository.save(entity, { transaction: true });
  }
}
