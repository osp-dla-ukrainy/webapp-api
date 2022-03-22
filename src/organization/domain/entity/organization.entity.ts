import { IsEnum, IsString, validate, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { IdValueTransformer } from '../../../shared/database/value-transformer/id.value-transformer';
import { RootAggregate } from '../../../shared/events/root-aggregate';
import { ValidationException } from '../../../shared/exception/validation.exception';
import { OrganizationCreated } from '../event/organization-created';
import { Contact } from '../value-object/contact.entity';
import { Location } from '../value-object/location.entity';
import { OrganizationId } from '../value-object/organization-id';
import { OrganizationType } from '../value-object/organization-type';
import { Qualification } from '../value-object/qualifications.entity';
import { Participant } from './participant.entity';

@Entity()
export class Organization extends RootAggregate {
  static createEntity({
    organizationId,
    owner,
    location,
    contact,
    name,
    qualifications,
    type,
  }: {
    name: string;
    organizationId: OrganizationId;
    owner: Participant;
    location: Location;
    contact: Contact;
    qualifications: Qualification[];
    type: OrganizationType;
  }): Organization {
    const organization = new Organization({
      id: organizationId,
      owner,
      type,
      location,
      contact,
      name,
      isVerified: false,
      qualifications,
    });

    organization.apply(
      new OrganizationCreated({
        type: organization.type,
        organizationId: organization.id,
        ownerId: organization.owner.id,
        location,
        contact,
        name,
        qualifications,
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

  @ValidateNested()
  @ManyToOne(() => Participant, { nullable: false })
  @JoinColumn()
  owner: Participant;

  @ValidateNested()
  @OneToOne(() => Location, { nullable: false })
  @JoinColumn()
  location: Location;

  @Column()
  @IsString()
  name: string;

  @ValidateNested()
  @OneToOne(() => Contact, { nullable: false })
  @JoinColumn()
  contact: Contact;

  @Column({ default: false })
  isVerified: boolean;

  @ValidateNested()
  @OneToMany(() => Qualification, (q) => q.organization)
  qualifications: Qualification[];

  constructor(partial: Partial<Organization>) {
    super();
    Object.assign(this, partial);
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length) {
      throw ValidationException.createEntityValidationException(errors);
    }
  }
}
