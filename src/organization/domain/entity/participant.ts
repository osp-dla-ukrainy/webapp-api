import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { IdValueTransformer } from '../../../shared/database/value-transformer/id.value-transformer';
import { RootAggregate } from '../../../shared/events/root-aggregate';
import { ParticipantCreated } from '../event/participant-created';
import { ParticipantId } from '../value-object/participant-id';

@Unique(['userId'])
@Entity()
export class Participant extends RootAggregate {
  static create({ id, userId }: { userId: string; id: ParticipantId }): Participant {
    const owner = new Participant({
      id,
      userId,
    });

    owner.apply(
      new ParticipantCreated({
        userId: owner.userId,
        participantId: owner.id,
      })
    );

    return owner;
  }

  @PrimaryColumn('uuid', {
    name: 'participant_id',
    transformer: new IdValueTransformer(ParticipantId),
  })
  id: ParticipantId;

  @Column('uuid')
  userId: string;

  constructor(partial: Partial<Participant>) {
    super();
    Object.assign(this, partial);
  }
}
