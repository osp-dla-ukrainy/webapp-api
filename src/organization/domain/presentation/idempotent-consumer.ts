import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class IdempotentConsumer {
  @PrimaryColumn('uuid')
  eventId: string;

  @PrimaryColumn({ type: 'varchar' })
  consumer: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<IdempotentConsumer>) {
    Object.assign(this, partial);
  }
}
