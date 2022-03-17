import { IsPhoneNumber } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact extends BaseEntity {
  static createEntity({ phone }: { phone: string }) {
    return new Contact({
      phone,
    });
  }

  @PrimaryGeneratedColumn('uuid', { name: 'contact_id' })
  private id: string;

  @IsPhoneNumber()
  @Column()
  phone: string;

  constructor(partial: Partial<Contact>) {
    super();
    Object.assign(this, partial);
  }
}
