import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AvailableQualification extends BaseEntity {
  @PrimaryColumn()
  name: string;

  constructor(partial: Partial<AvailableQualification>) {
    super();
    Object.assign(this, partial);
  }
}
