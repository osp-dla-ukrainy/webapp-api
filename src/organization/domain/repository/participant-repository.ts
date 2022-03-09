import { injectable } from 'inversify';
import { DomainEvent } from '../../../shared/events/domain-event';
import { EventHandler } from '../../../shared/events/event-handler';
import { ParticipantId } from '../value-object/participant-id';
import { Participant, ParticipantCurrentState } from '../entity/participant';

@injectable()
export abstract class ParticipantRepository implements EventHandler<DomainEvent<ParticipantCurrentState>> {
  abstract save(entity: Participant): Promise<void>;

  abstract findOne(id: ParticipantId): Promise<Participant | undefined>;

  abstract findOneByUserId({ userId }: { userId: string }): Promise<Participant | undefined>;

  abstract handle(event: DomainEvent<ParticipantCurrentState>): Promise<void> | void;
}
