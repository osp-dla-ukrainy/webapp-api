import { plainToInstance } from 'class-transformer';
import { injectable } from 'inversify';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { DomainEvent } from '../../../shared/events/domain-event';
import { EventHandler } from '../../../shared/events/event-handler';
import { ParticipantEvents } from '../../domain/event/event-types';
import { ParticipantCreated } from '../../domain/event/participant-created';
import { OrganizationPresentation } from '../../domain/presentation/organization-presentation';
import { ParticipantPresentation } from '../../domain/presentation/participant-presentation';
import { ParticipantId } from '../../domain/value-object/participant-id';
import { Participant, ParticipantCurrentState } from '../../domain/entity/participant';
import { ParticipantRepository } from '../../domain/repository/participant-repository';
import {
  OrganizationReadableConnection,
  OrganizationWritableConnection,
} from '../database/organization-database.config';
import { EventStore } from '../events/event.store';

@injectable()
export class TypeormParticipantRepository extends ParticipantRepository implements EventHandler<any> {
  private readonly repository: Repository<EventStore<DomainEvent<ParticipantCurrentState>>> = getRepository(
    EventStore,
    OrganizationWritableConnection
  );
  private get presentationRepository() {
    return this.presentationQueryRunner
      ? this.presentationQueryRunner.manager.getRepository(ParticipantPresentation)
      : getRepository(ParticipantPresentation, OrganizationReadableConnection);
  }

  constructor(private readonly presentationQueryRunner?: QueryRunner) {
    super();
  }

  async save(entity: Participant): Promise<void> {
    const eventToStore = entity.events.map(
      (event) =>
        new EventStore({
          entityId: entity.id.id,
          data: event,
          createdAt: event.createdAt,
          type: event.constructor.name,
          entity: Participant.name,
        })
    );

    await this.repository.save(eventToStore);
  }

  async handle(domainEvent: DomainEvent<ParticipantCurrentState>): Promise<void> {
    if (domainEvent instanceof ParticipantCreated) {
      await this.presentationRepository.insert(
        new ParticipantPresentation({
          id: domainEvent.participantId.id,
          userId: domainEvent.userId,
        })
      );
    }
  }

  async findOneByUserId({ userId }: { userId: string }): Promise<Participant | undefined> {
    const participant = await this.presentationRepository.findOne({ where: { userId } });

    if (!participant) {
      return undefined;
    }

    return this.findOne(new ParticipantId(participant.id));
  }

  async findOne(id: ParticipantId): Promise<Participant | undefined> {
    const storedEvents = await this.repository.find({
      entityId: id.id,
      entity: Participant.name,
    });

    const owner = new Participant({ id });

    storedEvents.forEach((storedEvent) => {
      const instance = ParticipantEvents.get(storedEvent.type);

      const event: DomainEvent<ParticipantCurrentState> = plainToInstance(instance, storedEvent.data);

      owner.apply(event);
    });

    return owner;
  }
}
