import { plainToInstance } from 'class-transformer';
import { injectable } from 'inversify';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { DomainEvent } from '../../../shared/events/domain-event';
import { EventHandler } from '../../../shared/events/event-handler';
import { nameofWithAlias } from '../../../shared/utils/nameof';
import { Organization } from '../../domain/entity/organization';
import { OrganizationCurrentState } from '../../domain/entity/organization-current-state';
import { OrganizationEvents } from '../../domain/event/event-types';
import { OrganizationCreated } from '../../domain/event/organization-created';
import { OrganizationPresentation } from '../../domain/presentation/organization-presentation';
import { ParticipantPresentation } from '../../domain/presentation/participant-presentation';
import { OrganizationRepository } from '../../domain/repository/organization.repository';
import { OrganizationId } from '../../domain/value-object/organization-id';
import { ParticipantId } from '../../domain/value-object/participant-id';
import {
  OrganizationReadableConnection,
  OrganizationWritableConnection,
} from '../database/organization-database.config';
import { EventStore } from '../events/event.store';

@injectable()
export class TypeormOrganizationRepository extends OrganizationRepository implements EventHandler<DomainEvent<any>> {
  private readonly repository: Repository<EventStore<DomainEvent<OrganizationCurrentState>>> = getRepository(
    EventStore,
    OrganizationWritableConnection
  );

  private get presentationRepository() {
    return this.presentationQueryRunner
      ? this.presentationQueryRunner.manager.getRepository(OrganizationPresentation)
      : getRepository(OrganizationPresentation, OrganizationReadableConnection);
  }

  constructor(private readonly presentationQueryRunner?: QueryRunner) {
    super();
  }

  async handle(domainEvent: DomainEvent<OrganizationCurrentState>): Promise<void> {
    const participantRepository = await getRepository(ParticipantPresentation, OrganizationReadableConnection);

    if (domainEvent instanceof OrganizationCreated) {
      const participant = await participantRepository.findOne({ id: domainEvent.ownerId.id });

      await this.presentationRepository.save(
        new OrganizationPresentation({
          owner: participant,
          id: domainEvent.organizationId.id,
          type: domainEvent.type,
        })
      );
    }
  }

  async findOneByOwner(id: ParticipantId): Promise<Organization | undefined> {
    const organization = await this.presentationRepository
      .createQueryBuilder('o')
      .innerJoinAndSelect(
        nameofWithAlias<OrganizationPresentation>((o) => o.owner),
        'oo'
      )
      .where(`${nameofWithAlias<ParticipantPresentation>((oo) => oo.id)} = :participantId`, { participantId: id.id })
      .getOne();

    if (!organization) {
      return undefined;
    }

    return this.fineOne(new OrganizationId(organization.id));
  }

  async save(entity: Organization) {
    const eventToStore = entity.events.map(
      (event) =>
        new EventStore({
          entityId: entity.id.id,
          data: event,
          createdAt: event.createdAt,
          type: event.constructor.name,
          entity: Organization.name,
        })
    );

    await this.repository.save(eventToStore);
  }

  async fineOne(id: OrganizationId): Promise<Organization | undefined> {
    const storedEvents = await this.repository.find({
      entityId: id.id,
      entity: Organization.name,
    });

    if (!storedEvents.length) {
      return undefined;
    }

    const organization = new Organization({ id });

    storedEvents.forEach((storedEvent) => {
      const instance = OrganizationEvents.get(storedEvent.type);

      const event: DomainEvent<OrganizationCurrentState> = plainToInstance(instance, storedEvent.data);

      organization.apply(event);
    });

    return organization;
  }
}
