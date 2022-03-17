import { injectable } from 'inversify';
import { Participant } from '../entity/participant.entity';
import { ParticipantId } from '../value-object/participant-id';

@injectable()
export abstract class ParticipantRepository {
  abstract save(entity: Participant): Promise<void>;

  abstract findOne(id: ParticipantId): Promise<Participant | undefined>;

  abstract findOneByUserId({ userId }: { userId: string }): Promise<Participant | undefined>;
}
