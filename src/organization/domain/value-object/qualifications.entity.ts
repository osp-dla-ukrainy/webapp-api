import { IsString } from 'class-validator';
import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Organization } from '../entity/organization.entity';

@Unique(['name', 'organization'])
@Entity()
export class Qualification extends BaseEntity {
  static createEntity({ name }: { name: string }) {
    return new Qualification({
      name,
    });
  }

  @PrimaryGeneratedColumn('uuid', { name: 'qualification_id' })
  private id: string;

  @IsString()
  @Column()
  name: string;

  @ManyToOne(() => Organization, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<Qualification>) {
    super();
    Object.assign(this, partial);
  }
}
