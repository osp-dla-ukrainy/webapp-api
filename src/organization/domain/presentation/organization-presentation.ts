import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrganizationType } from '../value-object/organization-type';
import { ParticipantPresentation } from './participant-presentation';

@Entity()
export class OrganizationPresentation {
  @PrimaryColumn('uuid', {
    name: 'organization_id',
  })
  id: string;

  @Column({ type: 'varchar' })
  type: OrganizationType;

  @ManyToOne(() => ParticipantPresentation, { nullable: true })
  @JoinColumn()
  owner: ParticipantPresentation;

  constructor(partial: Partial<OrganizationPresentation>) {
    Object.assign(this, partial);
  }
}
