import { Type } from 'class-transformer';
import { DomainEvent } from '../../../shared/events/domain-event';
import { ParticipantCurrentState } from '../entity/participant';
import { ParticipantId } from '../value-object/participant-id';

export class ParticipantCreated extends DomainEvent<ParticipantCurrentState> {
  @Type(() => ParticipantId)
  readonly participantId: ParticipantId;
  readonly userId: string;

  constructor(partial: Partial<ParticipantCreated>) {
    super();
    Object.assign(this, partial);
  }

  apply(state: ParticipantCurrentState): void {
    state.userId = this.userId;
  }
}
