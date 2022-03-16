import { IsEnum } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { IdValueTransformer } from '../../../shared/database/value-transformer/id.value-transformer';
import { RootAggregate } from '../../../shared/events/root-aggregate';
import { OrganizationCreated } from '../event/organization-created';
import { Location } from '../value-object/location';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { Participant } from './participant';

@Entity()
export class Organization extends RootAggregate {
  static createEntity({
    organizationId,
    owner,
    location,
  }: {
    organizationId: OrganizationId;
    owner: Participant;
    location: Location;
  }): Organization {
    const organization = new Organization({
      id: organizationId,
      owner,
      type: OrganizationType.Ordinary,
      location,
    });

    organization.apply(
      new OrganizationCreated({
        type: organization.type,
        organizationId: organization.id,
        ownerId: organization.owner.id,
        location,
      })
    );

    return organization;
  }

  @PrimaryColumn('uuid', {
    name: 'organization_id',
    transformer: new IdValueTransformer(OrganizationId),
  })
  id: OrganizationId;

  @IsEnum(OrganizationType)
  @Column({ type: 'varchar' })
  type: OrganizationType;

  @ManyToOne(() => Participant, { nullable: false })
  @JoinColumn()
  owner: Participant;

  @OneToOne(() => Location, { nullable: false })
  @JoinColumn()
  location: Location;

  constructor(partial: Partial<Organization>) {
    super();
    Object.assign(this, partial);
  }
}
