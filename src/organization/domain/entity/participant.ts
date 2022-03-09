import { Type } from 'class-transformer';
import { RootAggregate } from '../../../shared/events/root-aggregate';
import { ParticipantCreated } from '../event/participant-created';
import { ParticipantId } from '../value-object/participant-id';

export class ParticipantCurrentState {
  userId: string;
}

export class Participant extends RootAggregate<ParticipantCurrentState> {
  static create({ id, userId }: { userId: string; id: ParticipantId }): Participant {
    const owner = new Participant({
      id,
    });

    owner.apply(
      new ParticipantCreated({
        userId,
        participantId: id,
      })
    );

    return owner;
  }

  @Type(() => Participant)
  id: ParticipantId;
  @Type(() => ParticipantCurrentState)
  currentState: ParticipantCurrentState = new ParticipantCurrentState();

  constructor(partial: Partial<Participant>) {
    super();
    Object.assign(this, partial);
  }
}
