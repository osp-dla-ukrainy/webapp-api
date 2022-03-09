import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ParticipantPresentation {
  @PrimaryColumn('uuid', {
    name: 'participant_id',
  })
  id: string;

  @PrimaryColumn('uuid')
  userId: string;

  constructor(partial: Partial<ParticipantPresentation>) {
    Object.assign(this, partial);
  }
}
