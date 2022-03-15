import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { Participant } from '../src/organization/domain/entity/participant';
import { ParticipantId } from '../src/organization/domain/value-object/participant-id';
import { OrganizationConnection } from '../src/organization/infrastructure/database/organization-database.config';

export function saveParticipant(opts?: Partial<Participant>): Promise<Participant> {
  return getRepository(Participant, OrganizationConnection).save(
    new Participant({
      id: ParticipantId.create(),
      userId: v4(),
      ...opts,
    })
  );
}
