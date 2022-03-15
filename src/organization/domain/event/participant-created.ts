import { DomainEvent } from '../../../shared/events/domain-event';
import { Participant } from '../entity/participant';
import { ParticipantId } from '../value-object/participant-id';

export class ParticipantCreated extends DomainEvent {
  readonly participantId: ParticipantId;
  readonly userId: string;
  readonly entity: string = Participant.name;

  constructor(partial: Partial<ParticipantCreated>) {
    super();
    Object.assign(this, partial);
  }
}
